import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import authRouter from "./auth/authRoute";
import componentRouter from "./components/componentRouter";
import cartRouter from "./cart/cartRouter";
import permissionRouter from "./permission/permissionRouter";
import purchaseRouter from "./purchaseHistory/purchaseRouter";
import statisticsRouter from "./statistics/statisticsRouter";
import reminderRouter from "./reminders/reminderRouter";

config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
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

export { server, io };
