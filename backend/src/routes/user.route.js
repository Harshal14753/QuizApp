import { Router } from "express";
import { register, login, getProfile, logout } from "../controllers/user.controller.js"
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes
router.get("/profile", authUser, getProfile)
router.post("/logout", authUser, logout)

export default router;
