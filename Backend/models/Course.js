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
    // Video cho khóa học
    videoUrl: {
      type: String,
      default: "",
      description: "URL video giới thiệu (YouTube, Vimeo, etc.)",
    },
    lessons: [
      {
        title: {
          type: String,
          required: true,
        },
        videoUrl: {
          type: String,
          required: true,
          description: "URL video bài học",
        },
        duration: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    // Bài kiểm tra cho khóa học
    quizzes: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        questions: [
          {
            question: {
              type: String,
              required: true,
            },
            options: [
              {
                type: String,
                required: true,
              },
            ],
            correctAnswer: {
              type: Number,
              required: true,
              description: "Index của đáp án đúng (0-based)",
            },
            explanation: {
              type: String,
              default: "",
            },
          },
        ],
        passingScore: {
          type: Number,
          default: 70,
          description: "Điểm tối thiểu để pass (%)",
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
