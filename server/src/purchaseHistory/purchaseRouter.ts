import express from "express";
import {
  createPurchaseHistory,
  getAllPurchases,
  getPurchaseById,
  renewalOfPurchase,
  returnPurchase,
  editPurchase,
  getNotReturnedPurchases,
} from "./purchaseController";

const purchaseRouter = express.Router();

purchaseRouter.post("/", createPurchaseHistory);
purchaseRouter.get("/", getAllPurchases);
purchaseRouter.get("/user", getPurchaseById);
purchaseRouter.post("/renewal/:purchaseId", renewalOfPurchase);
purchaseRouter.post("/return/:purchaseId", returnPurchase);
purchaseRouter.put("/edit/:purchaseId", editPurchase);
purchaseRouter.get("/notreturned", getNotReturnedPurchases);

export default purchaseRouter;
