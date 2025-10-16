import express from "express";
import {
  getAllUsers,
  getDashboardStats,
  deleteUser,
  updateUserRole,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/admin.controller.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Tất cả route admin đều cần xác thực và quyền admin
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard statistics
router.get("/stats", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);

// Course management
router.get("/courses", getAllCourses);
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

export default router;
