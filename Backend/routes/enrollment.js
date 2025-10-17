import express from "express";
import {
  enrollCourse,
  getMyEnrollments,
  checkEnrollment,
  unenrollCourse,
  completeLesson,
  completeQuiz,
  completeCourse,
} from "../controllers/enrollment.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// Đăng ký khóa học
router.post("/enroll", enrollCourse);

// Lấy danh sách khóa học đã đăng ký
router.get("/my-courses", getMyEnrollments);

// Kiểm tra đã đăng ký khóa học chưa
router.get("/check/:courseId", checkEnrollment);

// Hủy đăng ký khóa học
router.delete("/unenroll/:courseId", unenrollCourse);

// Đánh dấu hoàn thành bài học
router.patch("/complete-lesson", completeLesson);
router.patch("/complete-quiz", completeQuiz);
router.post("/complete-course", completeCourse);

export default router;
