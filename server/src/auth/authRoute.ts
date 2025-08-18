import { Router } from "express";
import {
  getAllUsers,
  getUserProfile,
  isAdmin,
  logoutUser,
  refreshToken,
  signin,
  signup,
  updateUserProfile,
  updateUserRole,
  verifyUser,
} from "./authController";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);

authRouter.post("/refresh", refreshToken);
authRouter.get("/verify", verifyUser);
authRouter.post("/logout", logoutUser);

authRouter.get("/isadmin", isAdmin);
authRouter.get("/profile", getUserProfile);
authRouter.put("/update-profile", updateUserProfile);
authRouter.put("/update-role", updateUserRole);
authRouter.get("/users", getAllUsers);

export default authRouter;
