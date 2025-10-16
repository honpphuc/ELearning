import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Công nghệ thông tin", "Ngôn Ngữ", "Nhiếp Ảnh", ""],
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: "fas fa-book",
    },
    duration: {
      type: String,
      default: "",
    },
    students: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    // Thông tin chi tiết khóa học
    lectures: {
      type: Number,
      default: 0,
      description: "Số bài giảng",
    },
    exercises: {
      type: Number,
      default: 0,
      description: "Số bài tập",
    },
    instructor: {
      type: String,
      default: "",
      description: "Tên giảng viên",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", ""],
      default: "",
      description: "Trình độ khóa học",
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
