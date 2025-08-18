import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Request } from "express";

config();

const extractUserIdFromRefreshToken = (req: Request) => {
  const token = req.cookies.refreshToken;
  if (!token) return null;

  try {
    const secret = process.env.REFRESH_JWT_SECRET;
    if (!secret) {
      throw new Error(
        "REFRESH_JWT_SECRET is not defined in environment variables"
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

export default extractUserIdFromRefreshToken;
