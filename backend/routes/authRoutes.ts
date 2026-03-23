import express from "express";
import {
  loginUser,
  registerUser,
  verifyUser,
  logoutUser,
  loggedInUser
} from "../controllers/authControls";
import { Wrapper } from "../wrappers/wrapper";
import { isAuthorizedUser } from "../middleware/authMiddleware";
const router = express.Router();


router.post("/register", Wrapper(registerUser));
router.post("/login", Wrapper(loginUser));

router.get("/verify", isAuthorizedUser, Wrapper(verifyUser));
router.get("/logout", isAuthorizedUser, Wrapper(logoutUser));
router.get("/me", isAuthorizedUser, Wrapper(loggedInUser))
export default router;
