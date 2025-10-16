import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// -------------------- REGISTER --------------------
export const register = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);
    const { firstName, lastName, email, password, password_confirmation } =
      req.body;

    // 1️⃣ Kiểm tra dữ liệu bắt buộc
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !password_confirmation
    ) {
      return res.status(400).json({ error: "Dữ liệu không được bỏ trống" });
    }

    // 2️⃣ Kiểm tra xác nhận mật khẩu
    if (password !== password_confirmation) {
      return res.status(400).json({ error: "Mật khẩu không khớp" });
    }

    // 3️⃣ Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email đã được đăng ký" });
    }

    // 4️⃣ Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Tạo user mới
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const user = await User.create({
      name: fullName,
      email,
      password: hashedPassword,
    });

    // 6️⃣ Trả về phản hồi thành công
    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Đăng ký lỗi:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return res.status(400).json({ error: "Dữ liệu không được bỏ trống" });
    }

    // 2️⃣ Tìm người dùng
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Thông tin đăng nhập không hợp lệ" });
    }

    // 3️⃣ So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Thông tin đăng nhập không hợp lệ" });
    }

    // 4️⃣ Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    // 5️⃣ Trả về thông tin đăng nhập thành công
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.error("Đăng nhập lỗi:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
