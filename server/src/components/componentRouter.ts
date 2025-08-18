import express from "express";
import {
  getAllComponents,
  getComponentsByType,
  createComponent,
  updateComponent,
  deleteComponent,
  getComponentsCount,
} from "./componentController";
import { get } from "http";

const componentsRouter = express.Router();

componentsRouter.get("/", getAllComponents);
componentsRouter.get("/:componentType", getComponentsByType);
componentsRouter.post("/", createComponent);
componentsRouter.put("/:componentName", updateComponent);
componentsRouter.delete("/:componentName", deleteComponent);
componentsRouter.get("/all/count", getComponentsCount);

export default componentsRouter;
