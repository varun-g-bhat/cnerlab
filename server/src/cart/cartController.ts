import { NextFunction, Request, Response } from "express";
import cartModel from "./cartModel";
import extractUserIdFromRefreshToken from "../helpers/extractUserId";
import createHttpError from "http-errors";

const getAllCarts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const carts = await cartModel
      .find()
      .populate("componentId", "componentName image_url quantity");
    res.status(200).json(carts);
  } catch (error) {
    console.error("Error fetching carts:", error);
    res.status(500).json({ message: "Error fetching carts" });
  }
};

const getCartByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    // return res.status(401).json({ message: "Unauthorized" });

    return next(createHttpError(401, "Unauthorized"));
  }

  try {
    const cart = await cartModel
      .find({ userId })
      .populate("componentId", "componentName image_url quantity")
      .exec();

    // if (!cart.length) {
    //   return next(createHttpError(404, "No components in cart"));
    // }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching user's cart:", error);
    return next(createHttpError(500, "Error fetching cart"));
  }
};

const addComponentToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  const { componentId, quantity } = req.body;

  try {
    // Check if the component already exists in the user's cart
    const existingCart = await cartModel.findOne({ userId, componentId });

    if (existingCart) {
      // If it exists, update the quantity
      existingCart.quantity += quantity;
      await existingCart.save();
      return res
        .status(200)
        .json({ message: "Cart updated", cart: existingCart });
    }

    // If it doesn't exist, create a new cart item
    const newCartItem = new cartModel({
      userId,
      componentId,
      quantity,
    });

    await newCartItem.save();
    res
      .status(201)
      .json({ message: "Component added to cart", cart: newCartItem });
  } catch (error) {
    console.error("Error adding component to cart:", error);
    return next(createHttpError(500, "Error adding component to cart"));
  }
};

const updateComponentInCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  const { componentId, quantity } = req.body;

  try {
    // Check if the cart item exists
    const cartItem = await cartModel.findOne({ userId, componentId });

    if (!cartItem) {
      return next(createHttpError(404, "Component not found in cart"));
    }

    // Update the quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: "Cart item updated", cart: cartItem });
  } catch (error) {
    console.error("Error updating component in cart:", error);
    return next(createHttpError(500, "Error updating component in cart"));
  }
};

const removeComponentFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  const { componentId } = req.body;

  try {
    const cartItem = await cartModel.findOneAndDelete({ userId, componentId });

    if (!cartItem) {
      return next(createHttpError(404, "Component not found in cart"));
    }

    res.status(200).json({ message: "Component removed from cart" });
  } catch (error) {
    console.error("Error removing component from cart:", error);
    return next(createHttpError(500, "Error removing component from cart"));
  }
};

const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  const userId = extractUserIdFromRefreshToken(req);
  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  try {
    await cartModel.deleteMany({ userId });

    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return next(createHttpError(500, "Error clearing cart"));
  }
};

export {
  getAllCarts,
  getCartByUserId,
  addComponentToCart,
  updateComponentInCart,
  removeComponentFromCart,
  clearCart,
};
