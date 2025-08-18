import express from "express";
import {
  addPermissionRequest,
  getAllPermissions,
  getAllPermissionsByUserId,
  getAllPendingComponents,
  getAllApprovedComponents,
  getAllRejectedComponents,
  approveComponent,
  rejectComponent,
} from "./permissionController";

const permissionRouter = express.Router();
permissionRouter.post("/user/add", addPermissionRequest);
permissionRouter.get("/", getAllPermissions);
// @ts-ignore
permissionRouter.get("/user", getAllPermissionsByUserId);
permissionRouter.get("/pending", getAllPendingComponents);
// @ts-ignore
permissionRouter.get("/approved", getAllApprovedComponents);
// @ts-ignore
permissionRouter.get("/rejected", getAllRejectedComponents);
permissionRouter.put("/approve/:permissionId", approveComponent);
permissionRouter.put("/reject/:permissionId", rejectComponent);

export default permissionRouter;
