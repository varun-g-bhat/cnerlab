import express from "express";

import { getRequestCount, getUserCountNumber } from "./statisticsController";
import { VisitorCount } from "./statisticsModel";

const statisticsRouter = express.Router();
// statisticsRouter.get("/visitorcount", getVisitorCount);
statisticsRouter.get("/requestcount", getRequestCount);
statisticsRouter.get("/visitorcount", async (req, res) => {
  try {
    const count = await VisitorCount.incrementVisit();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Error incrementing visit count" });
  }
});
statisticsRouter.get("/usercount", getUserCountNumber);

export default statisticsRouter;
