import express, { NextFunction, Request, Response } from "express";
import { sendDueDateReminders } from "./reminderController";
import createHttpError from "http-errors";

const reminderRouter = express.Router();

reminderRouter.post(
  "/send-reminders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await sendDueDateReminders();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error sending reminders:", error);
      next(createHttpError(500, "Failed to send reminders"));
    }
  }
);

export default reminderRouter;
