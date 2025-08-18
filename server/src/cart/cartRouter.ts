import express from "express";
import {
  getAllCarts,
  getCartByUserId,
  addComponentToCart,
  updateComponentInCart,
  removeComponentFromCart,
  clearCart,
} from "./cartController";

const cartRouter = express.Router();

cartRouter.get("/", getAllCarts);
cartRouter.get("/user", getCartByUserId);
// @ts-ignore
cartRouter.post("/user", addComponentToCart);
cartRouter.delete("/user", clearCart);
cartRouter.put("/user", updateComponentInCart);
cartRouter.delete("/user/component", removeComponentFromCart);

export default cartRouter;
