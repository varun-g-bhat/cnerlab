import express from "express";
import {
  getAllComponents,
  getComponentsByType,
  createComponent,
  updateComponent,
  deleteComponent,
  getComponentsCount,
  getComponentsType,
} from "./componentController";
import { get } from "http";

const componentsRouter = express.Router();

componentsRouter.get("/", getAllComponents);
componentsRouter.get("/all/count", getComponentsCount);
componentsRouter.get("/all/types", getComponentsType);
componentsRouter.get("/:componentType", getComponentsByType);
componentsRouter.post("/", createComponent);
componentsRouter.put("/:componentName", updateComponent);
componentsRouter.delete("/:componentName", deleteComponent);

export default componentsRouter;
