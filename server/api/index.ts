import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "../src/middlewares/globalErrorHandler";
import authRouter from "../src/auth/authRoute";
import componentRouter from "../src/components/componentRouter";
import cartRouter from "../src/cart/cartRouter";
import permissionRouter from "../src/permission/permissionRouter";
import purchaseRouter from "../src/purchaseHistory/purchaseRouter";
import statisticsRouter from "../src/statistics/statisticsRouter";
import reminderRouter from "../src/reminders/reminderRouter";
import connectDB from "../src/config/db";

config();

const app = express();

// Initialize database connection
connectDB();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "*",
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({
    message: "Welcome to CNER LAB Express Backend",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/components", componentRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/permission", permissionRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/statistics", statisticsRouter);
app.use("/api/v1/reminders", reminderRouter);
app.use(globalErrorHandler);

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
