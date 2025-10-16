import User from "../models/User.js";
import Course from "../models/Course.js";

// Lấy tất cả người dùng
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Lấy thống kê dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalAdmins,
      totalRegularUsers: totalUsers - totalAdmins,
      recentUsers,
    });
  } catch (error) {
    console.error("Lấy dữ liệu thất bại", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Xóa người dùng
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Không cho phép xóa chính mình
    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "Không thể xóa tài khoản của chính mình" });
    }

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    res.json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    console.error("Xóa người dùng lỗi:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Cập nhật role người dùng
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Vai trò không hợp lệ" });
    }

    // Không cho phép thay đổi role của chính mình
    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "Không thể thay đổi vai trò của chính mình" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    res.json({ message: "Cập nhật vai trò người dùng thành công", user });
  } catch (error) {
    console.error("Cập nhật vai trò người dùng lỗi:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// ==================== COURSE MANAGEMENT ====================

// Lấy tất cả khóa học
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Tạo khóa học mới
export const createCourse = async (req, res) => {
  try {
    const { 
      title, 
      category, 
      description, 
      price, 
      icon, 
      duration,
      rating,
      lectures,
      exercises,
      instructor,
      level
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Tiêu đề khóa học là bắt buộc" });
    }

    const course = new Course({
      title,
      category,
      description,
      price: price || 0,
      icon: icon || "fas fa-book",
      duration: duration || "",
      rating: rating || 0,
      lectures: lectures || 0,
      exercises: exercises || 0,
      instructor: instructor || "",
      level: level || "",
    });

    await course.save();
    res.status(201).json({ message: "Tạo khóa học thành công", course });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Cập nhật khóa học
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const course = await Course.findByIdAndUpdate(id, updateData, { new: true });

    if (!course) {
      return res.status(404).json({ error: "Khóa học không tồn tại" });
    }

    res.json({ message: "Cập nhật khóa học thành công", course });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// Xóa khóa học
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ error: "Khóa học không tồn tại" });
    }

    res.json({ message: "Xóa khóa học thành công" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

