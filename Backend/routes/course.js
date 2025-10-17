import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

// Public route - Lấy khóa học phổ biến (sắp xếp theo số học viên nhiều nhất)
router.get("/popular", async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({ students: -1 }) // Sắp xếp theo số học viên giảm dần
      .limit(6); // Lấy 6 khóa học phổ biến nhất
    res.json(courses);
  } catch (error) {
    console.error("Get popular courses error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

// Public route - Lấy tất cả khóa học (không cần authentication)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    // Thêm trường tổng hợp số bài học, số video, số bài kiểm tra
    const result = courses.map((course) => ({
      ...course.toObject(),
      lessonCount: course.lessons ? course.lessons.length : 0,
      videoCount: course.lessons ? course.lessons.filter(l => l.videoUrl).length : 0,
      quizCount: course.quizzes ? course.quizzes.length : 0,
    }));
    res.json(result);
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

// Public route - Lấy chi tiết khóa học theo ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Khóa học không tồn tại" });
    }
    // Thêm trường tổng hợp số bài học, số video, số bài kiểm tra
    const result = {
      ...course.toObject(),
      lessonCount: course.lessons ? course.lessons.length : 0,
      videoCount: course.lessons ? course.lessons.filter(l => l.videoUrl).length : 0,
      quizCount: course.quizzes ? course.quizzes.length : 0,
    };
    res.json(result);
  } catch (error) {
    console.error("Get course detail error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

export default router;
