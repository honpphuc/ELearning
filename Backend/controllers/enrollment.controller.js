// Đánh dấu hoàn thành bài học
export const completeLesson = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, lessonId } = req.body;
    if (!courseId || !lessonId) {
      return res.status(400).json({ error: "Thiếu courseId hoặc lessonId" });
    }
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ error: "Bạn chưa đăng ký khóa học này" });
    }
    // Nếu đã có thì không thêm lại
    if (!enrollment.completedLessons) enrollment.completedLessons = [];
    if (
      !enrollment.completedLessons.map((id) => id.toString()).includes(lessonId)
    ) {
      enrollment.completedLessons.push(lessonId);
      // Cập nhật progress
      const course = await Course.findById(courseId);
      const totalLessons = course?.lessons?.length || 0;
      const totalQuizzes = course?.quizzes?.length || 0;
      const totalItems = Math.max(1, totalLessons + totalQuizzes);
      const doneCount =
        (enrollment.completedLessons?.length || 0) +
        (enrollment.completedQuizzes?.length || 0);
      enrollment.progress = Math.min(
        100,
        Math.round((doneCount / totalItems) * 100)
      );
      if (doneCount === totalItems) enrollment.completed = true;
      await enrollment.save();
    }
    res.json({
      success: true,
      completedLessons: enrollment.completedLessons,
      progress: enrollment.progress,
      completed: enrollment.completed,
    });
  } catch (error) {
    console.error("Complete lesson error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Đánh dấu hoàn thành bài kiểm tra
export const completeQuiz = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, quizId } = req.body;
    if (!courseId || !quizId) {
      return res.status(400).json({ error: "Thiếu courseId hoặc quizId" });
    }
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ error: "Bạn chưa đăng ký khóa học này" });
    }
    if (!enrollment.completedQuizzes) enrollment.completedQuizzes = [];
    if (
      !enrollment.completedQuizzes.map((id) => id.toString()).includes(quizId)
    ) {
      enrollment.completedQuizzes.push(quizId);
      // Cập nhật progress dựa trên tổng lessons + quizzes
      const course = await Course.findById(courseId);
      const totalLessons = course?.lessons?.length || 0;
      const totalQuizzes = course?.quizzes?.length || 0;
      const totalItems = Math.max(1, totalLessons + totalQuizzes);
      const doneCount =
        (enrollment.completedLessons?.length || 0) +
        (enrollment.completedQuizzes?.length || 0);
      enrollment.progress = Math.min(
        100,
        Math.round((doneCount / totalItems) * 100)
      );
      if (doneCount === totalItems) enrollment.completed = true;
      await enrollment.save();
    }
    res.json({
      success: true,
      completedQuizzes: enrollment.completedQuizzes,
      progress: enrollment.progress,
      completed: enrollment.completed,
    });
  } catch (error) {
    console.error("Complete quiz error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// Đánh dấu hoàn thành toàn bộ khóa học
export const completeCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: "Thiếu courseId" });
    }
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ error: "Bạn chưa đăng ký khóa học này" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Khóa học không tồn tại" });
    }
    const lessonIds = (course.lessons || []).map((l) => l._id);
    enrollment.completedLessons = lessonIds;
    // Nếu có quiz, có thể cân nhắc đánh dấu ở đây nếu muốn, hiện giữ nguyên.
    enrollment.progress = 100;
    enrollment.completed = true;
    await enrollment.save();
    return res.json({
      success: true,
      completedLessons: enrollment.completedLessons,
      progress: enrollment.progress,
      completed: enrollment.completed,
    });
  } catch (error) {
    console.error("Complete course error:", error);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Đăng ký khóa học
export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    // Kiểm tra khóa học có tồn tại không
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Khóa học không tồn tại" });
    }

    // Kiểm tra đã đăng ký chưa
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ error: "Bạn đã đăng ký khóa học này rồi" });
    }

    // Tạo enrollment mới
    const enrollment = new Enrollment({ userId, courseId });
    await enrollment.save();

    // Tăng số học viên của khóa học
    course.students = (course.students || 0) + 1;
    await course.save();

    res.status(201).json({
      message: "Đăng ký khóa học thành công",
      enrollment,
    });
  } catch (error) {
    console.error("Enroll course error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Lấy danh sách khóa học đã đăng ký của user
export const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ userId })
      .populate("courseId")
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Kiểm tra đã đăng ký khóa học chưa
export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({ userId, courseId });
    res.json({ enrolled: !!enrollment });
  } catch (error) {
    console.error("Check enrollment error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Hủy đăng ký khóa học
export const unenrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOneAndDelete({ userId, courseId });

    if (!enrollment) {
      return res.status(404).json({ error: "Bạn chưa đăng ký khóa học này" });
    }

    // Giảm số học viên
    await Course.findByIdAndUpdate(courseId, { $inc: { students: -1 } });

    res.json({ message: "Hủy đăng ký thành công" });
  } catch (error) {
    console.error("Unenroll course error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
