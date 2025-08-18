import { NextFunction, Request, Response } from "express";

import { VisitorCount, RequestCount } from "./statisticsModel";
import { getUserCount } from "../helpers/data";
import createHttpError from "http-errors";

const getVisitorCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const visitorCount = await VisitorCount.findOne();
    res.status(200).json(visitorCount);
  } catch (error) {
    next(createHttpError(500, "Error fetching visitor count"));
  }
};

const getRequestCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestCount = await RequestCount.findOne();
    res.status(200).json(requestCount);
  } catch (error) {
    next(createHttpError(500, "Error fetching request count"));
  }
};

const getUserCountNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = await getUserCount();

    res.status(200).json({ userCount: count });
  } catch (error) {
    next(createHttpError(500, "Error fetching user count"));
  }
};

export { getVisitorCount, getRequestCount, getUserCountNumber };
