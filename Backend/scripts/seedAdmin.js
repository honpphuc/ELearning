import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/edulearn"
    );
    console.log("✅ Connected to MongoDB");

    // Kiểm tra xem admin đã tồn tại chưa
    const adminEmail = "example@demo.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists:", adminEmail);
      
      // Cập nhật role nếu chưa phải admin
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("✅ Updated existing user to admin role");
      }
    } else {
      // Tạo admin mới
      const hashedPassword = await bcrypt.hash("123456a@", 10);
      
      const adminUser = await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Admin user created successfully!");
      console.log("📧 Email:", adminUser.email);
      console.log("🔑 Password: 123456a@");
    }

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
