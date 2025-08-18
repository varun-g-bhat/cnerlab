import jwt from "jsonwebtoken";
import { Request } from "express";

const extractUserIdFromAccessToken = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.ACCESS_JWT_SECRET;
    if (!secret) {
      throw new Error(
        "ACCESS_JWT_SECRET is not defined in environment variables"
      );
    }

    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "object" && "id" in decoded) {
      return decoded.id;
    }
    return null;
  } catch (err) {
    console.error("JWT verify error:", err);
    return null;
  }
};

export default extractUserIdFromAccessToken;
