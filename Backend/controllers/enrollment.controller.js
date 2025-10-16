import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

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
      enrollment 
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
