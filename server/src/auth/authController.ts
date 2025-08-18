import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { prisma } from "../../prisma/client";
import bcrypt from "bcryptjs";
import { sendPasswordEmail } from "../helpers/sendEmail";
import {
  getUserByEmail,
  getUserById,
  getUserRoleByUserId,
} from "../helpers/data";
import { generateTokens } from "../helpers/generateTokens";
import pkg from "jsonwebtoken";
import { getRandomAvatar } from "@fractalsoftware/random-avatar-generator";
import generatePassword from "../helpers/generatePassword";
import extractUserIdFromRefreshToken from "../helpers/extractUserId";
import extractUserIdFromAccessToken from "../helpers/extractUserIdFromAccessToken";

const { verify } = pkg;

const emailRegex = /^[A-Za-z0-9]+@[bmsit]+\.(in)$/;

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email } = req.body;

  try {
    if (!emailRegex.test(email)) {
      const error = createHttpError(
        400,
        "Please use your official Bmsit college mail"
      );
      return next(error);
    }

    const password = generatePassword();

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      const error = createHttpError(400, "User already exists with this email");
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = getRandomAvatar(8);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        image: avatar,
        emailVerified: new Date(), // Automatically verify email
      },
    });

    if (newUser) {
      // Send password to user's email without OTP
      await sendPasswordEmail(newUser.email, password);

      res.status(200).json({
        message: "Account created successfully! Password sent to your email.",
        isVerified: true,
        success: true,
      });
      return;
    }

    return next(
      createHttpError(500, "Unexpected error occurred while creating user")
    );
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "Error while processing your request"));
  }
};

const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
      res.status(404).json({ message: "User with email not found" });
      return;
    }

    if (!user.password) {
      return next(createHttpError(400, "Invalid credentials"));
    }

    const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) {
      return next(createHttpError(400, "Invalid credentials"));
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    console.log("Role:", user.role);
    console.log("User emailId:", user.email);

    res.json({
      accessToken,
      isVerified: true,
      success: true,
      userId: user.id,
      username: user.username,
      role: user.role,
      profile: user.image,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while processing your request"));
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(createHttpError(403, "No refresh token provided"));
    }

    verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET!,
      async (err: Error | null, decoded: any) => {
        if (err || !decoded) {
          return next(createHttpError(403, "Invalid or expired refresh token"));
        }

        const user = await getUserById(decoded.id);
        if (!user) {
          return next(createHttpError(403, "User not found"));
        }

        const { accessToken } = generateTokens(user.id);

        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error refreshing token"));
  }
};

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      createHttpError(401, "Authorization header missing or invalid")
    );
  }

  const token = authHeader.split(" ")[1];

  verify(
    token,
    process.env.ACCESS_JWT_SECRET! as string,
    {},
    async (err: Error | null, decoded: any) => {
      if (err || !decoded) {
        return next(createHttpError(401, "Invalid or expired refresh token"));
      }

      const user = await getUserById(decoded.id);
      if (!user) {
        return next(createHttpError(403, "User not found"));
      }

      res.json({
        userId: user.id,
        username: user.username,
        profile: user.image,
        role: user.role,
      });
    }
  );
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    return next(createHttpError(500, "Error while LogOut the user"));
  }
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  try {
    const userRole = await getUserRoleByUserId(userId);

    res.json({ role: userRole });
  } catch (error) {
    return next(createHttpError(500, "Error while fetching user role"));
  }
};

// const updateUserProfile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = extractUserIdFromRefreshToken(req);
//   if (!userId) {
//     return next(createHttpError(401, "Unauthorized"));
//   }

//   try {
//     const user = await getUserById(userId);
//     if (!user) {
//       return next(createHttpError(404, "User not found"));
//     }

//     const { username, email, role, password } = req.body;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await prisma.user.update({
//       where: { id: userId },
//       data: { username, email, role, password: hashedPassword },
//     });

//     res.status(200).json({ message: "Profile updated successfully" });
//   } catch (error) {
//     console.error(error);
//     return next(createHttpError(500, "Error updating user profile"));
//   }
// };

const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromAccessToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    const { username, email, password } = req.body;

    const updateData: any = { username, email };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error updating user profile"));
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error fetching users"));
  }
};

const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    if (user.role !== "admin") {
      return next(createHttpError(403, "Only admin can update user roles"));
    }

    const { userIdToUpdate, role } = req.body;

    await prisma.user.update({
      where: { id: userIdToUpdate },
      data: { role },
    });

    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error updating user role"));
  }
};

const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromAccessToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Error fetching user profile"));
  }
};

export {
  signup,
  signin,
  refreshToken,
  verifyUser,
  logoutUser,
  isAdmin,
  updateUserProfile,
  getUserProfile,
  updateUserRole,
  getAllUsers,
};
