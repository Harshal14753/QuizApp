import { Router } from "express";
import { register, login, getProfile, logout, getQuizTypes, getCategories, getBasicItemsByType, getQuizQuestions, addCoins } from "../controllers/user.controller.js"
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", register)
router.post("/login", login)
router.get("/quiz-types", getQuizTypes)
router.get("/categories", getCategories)
router.get("/basic-items/:type", getBasicItemsByType)
router.get("/questions", getQuizQuestions)

// Protected routes
router.get("/profile", authUser, getProfile)
router.post("/logout", authUser, logout)
router.post("/add-coins", authUser, addCoins)

export default router;
