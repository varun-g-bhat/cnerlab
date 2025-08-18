import { NextFunction, Request, Response } from "express";
import componentModel from "./componentModel";
import createHttpError from "http-errors";

const getAllComponents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const components = await componentModel.find();
    res.status(200).json(components);
  } catch (error) {
    return next(createHttpError(500, "Error fetching components"));
  }
};

const getComponentsByType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const componentType = req.params.componentType;
  try {
    const components = await componentModel.find({ componentType });
    res.status(200).json(components);
  } catch (error) {
    return next(createHttpError(500, "Error fetching components"));
  }
};

const createComponent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { componentType, componentName, image_url, quantity } = req.body;
  try {
    const newComponent = new componentModel({
      componentType,
      componentName,
      image_url,
      quantity,
    });
    await newComponent.save();
    res.status(201).json(newComponent);
  } catch (error) {
    next(createHttpError(500, "Error creating component"));
  }
};

const updateComponent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const componentName = req.params.componentName;
  const { componentType, image_url, quantity } = req.body;
  try {
    const updatedComponent = await componentModel.findOneAndUpdate(
      { componentName },
      { componentType, image_url, quantity },
      { new: true }
    );
    if (!updatedComponent) {
      return next(createHttpError(404, "Component not found"));
    }
    res.status(200).json(updatedComponent);
  } catch (error) {
    next(createHttpError(500, "Error updating component"));
  }
};

const deleteComponent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const componentName = req.params.componentName;
  try {
    const deletedComponent = await componentModel.findOneAndDelete({
      componentName,
    });
    if (!deletedComponent) {
      return next(createHttpError(404, "Component not found"));
    }
    res.status(200).json({ message: "Component deleted successfully" });
  } catch (error) {
    return next(createHttpError(500, "Error deleting component"));
  }
};

const getComponentsCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const components = await componentModel.find();

    let count = 0;
    components.forEach((component) => {
      count += component.quantity;
    });

    res.status(200).json({ totalComponents: count });
  } catch (error) {
    next(createHttpError(500, "Error fetching components count"));
  }
};

export {
  getAllComponents,
  getComponentsByType,
  createComponent,
  updateComponent,
  deleteComponent,
  getComponentsCount,
};
