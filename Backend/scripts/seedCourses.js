import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";

dotenv.config();

async function run() {
  const uri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/onl";
  console.log("Connecting to:", uri);
  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");

  const samples = [
    {
      title: "React từ A-Z",
      category: "Công nghệ thông tin",
      description: "Học React từ cơ bản đến nâng cao với ví dụ thực tế.",
      price: 199000,
      icon: "fas fa-code",
      duration: "10 giờ",
      students: 0,
      rating: 4.5,
      instructor: "Nguyễn Văn B",
      level: "Beginner",
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
      lectures: 12,
      exercises: 8,
      lessons: [
        {
          title: "Giới thiệu React",
          videoUrl: "https://youtu.be/dQw4w9WgXcQ",
          duration: "10:00",
          order: 1,
        },
        {
          title: "JSX & Components",
          videoUrl: "https://youtu.be/dQw4w9WgXcQ",
          duration: "20:00",
          order: 2,
        },
      ],
      quizzes: [
        {
          title: "Quiz 1",
          description: "Ôn tập kiến thức cơ bản",
          questions: [
            {
              question: "JSX là gì?",
              options: ["HTML", "Cú pháp mở rộng JS", "CSS", "XML"],
              correctAnswer: 1,
            },
          ],
          passingScore: 70,
          order: 1,
        },
      ],
    },
    {
      title: "Node.js Cơ Bản",
      category: "Công nghệ thông tin",
      description: "Xây dựng server với Express và MongoDB.",
      price: 0,
      icon: "fas fa-server",
      duration: "6 giờ",
      students: 0,
      rating: 4.2,
      instructor: "Trần Văn C",
      level: "Beginner",
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
      lectures: 10,
      exercises: 6,
      lessons: [
        {
          title: "Cài đặt môi trường",
          videoUrl: "https://youtu.be/dQw4w9WgXcQ",
          duration: "08:00",
          order: 1,
        },
        {
          title: "Hello Express",
          videoUrl: "https://youtu.be/dQw4w9WgXcQ",
          duration: "15:00",
          order: 2,
        },
      ],
      quizzes: [],
    },
    {
      title: "Tiếng Anh Giao Tiếp",
      category: "Ngôn Ngữ",
      description: "Luyện phát âm và giao tiếp cơ bản.",
      price: 99000,
      icon: "fas fa-language",
      duration: "5 giờ",
      students: 0,
      rating: 4.0,
      instructor: "Lê Thị D",
      level: "Beginner",
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
      lectures: 8,
      exercises: 10,
      lessons: [
        {
          title: "Pronunciation Basics",
          videoUrl: "https://youtu.be/dQw4w9WgXcQ",
          duration: "12:00",
          order: 1,
        },
      ],
      quizzes: [],
    },
  ];

  const { deletedCount } = await Course.deleteMany({});
  console.log(`🗑️  Cleared courses: ${deletedCount}`);

  const inserted = await Course.insertMany(samples);
  console.log(`✅ Seeded courses: ${inserted.length}`);

  await mongoose.connection.close();
  console.log("🔌 Disconnected");
}

run().catch((err) => {
  console.error("❌ Seed courses error:", err);
  process.exit(1);
});
