import { Router } from "express";
import {
  getAllUsers,
  isAdmin,
  logoutUser,
  refreshToken,
  signin,
  signup,
  updateUserProfile,
  updateUserRole,
  verifyEmail,
  verifyUser,
} from "./authController";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/verify-email", verifyEmail);

authRouter.post("/refresh", refreshToken);
authRouter.get("/verify", verifyUser);
authRouter.post("/logout", logoutUser);

authRouter.get("/isadmin", isAdmin);
authRouter.put("/update-profile", updateUserProfile);
authRouter.put("/update-role", updateUserRole);
authRouter.get("/users", getAllUsers);

export default authRouter;
