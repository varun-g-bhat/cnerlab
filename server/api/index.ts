import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

config();

// Import routes
import authRouter from "../src/auth/authRoute";
import componentRouter from "../src/components/componentRouter";
import cartRouter from "../src/cart/cartRouter";
import permissionRouter from "../src/permission/permissionRouter";
import purchaseRouter from "../src/purchaseHistory/purchaseRouter";
import statisticsRouter from "../src/statistics/statisticsRouter";
import reminderRouter from "../src/reminders/reminderRouter";
import globalErrorHandler from "../src/middlewares/globalErrorHandler";
import connectDB from "../src/config/db";

let isConnected = false;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "CNER LAB API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    database: isConnected ? "connected" : "disconnected",
  });
});

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/components", componentRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/permission", permissionRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/statistics", statisticsRouter);
app.use("/api/v1/reminders", reminderRouter);

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    path: req.path,
  });
});

app.use(globalErrorHandler);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Connect to database if not already connected
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
