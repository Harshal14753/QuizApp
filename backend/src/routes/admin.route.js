import { Router } from "express";
import {
  login,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUser,
  getAdminProfile,
  changeAdminPassword,
  logout,
  getAllQuestion,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getBasicItemsByType,
  getBasicItemById,
  createBasicItem,
  updateBasicItem,
  deleteBasicItem
} from "../controllers/admin.controller.js";
import authAdmin from "../middleware/authAdmin.middleware.js";

const router = Router();

// Public route
router.post("/login", login);

// Protected routes
router.get("/users", authAdmin, getAllUsers);
router.get("/users/:id", authAdmin, getUserById);
router.delete("/users/:id", authAdmin, deleteUserById);
router.put("/users/:id", authAdmin, updateUser);

router.get("/profile", authAdmin, getAdminProfile);
router.put("/profile/password", authAdmin, changeAdminPassword);
router.post("/logout", authAdmin, logout);

// Protected Admin Question routes
router.get("/:quizType/questions", authAdmin, getAllQuestion);
router.get("/:quizType/question/:id", authAdmin, getQuestionById);
router.post("/:quizType/question", authAdmin, createQuestion);
router.put("/:quizType/question/:id", authAdmin, updateQuestion);
router.delete("/:quizType/question/:id", authAdmin, deleteQuestion);

// Protected Admin BasicItem routes (categories, skills, classifications, levels) can be added similarly
router.get('/basic-item/:basicItem', authAdmin, getBasicItemsByType);
router.get('/basic-item/:basicItem/:id', authAdmin, getBasicItemById);
router.post('/basic-item/:basicItem', authAdmin, createBasicItem);
router.put('/basic-item/:basicItem/:id', authAdmin, updateBasicItem);
router.delete('/basic-item/:basicItem/:id', authAdmin, deleteBasicItem);

export default router;
