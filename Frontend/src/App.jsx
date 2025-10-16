import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import Features from "./pages/Features";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetail from "./pages/CourseDetail";
import PaymentPage from "./pages/PaymentPage";
import "./App.css";

const sampleCourses = [
  {
    id: 1,
    icon: "fas fa-laptop-code",
    category: "Công nghệ",
    title: "React cho người mới",
    description: "Bắt đầu hành trình học React từ cơ bản tới nâng cao.",
    duration: "12 giờ",
    students: 1240,
    rating: 4.8,
    price: 199000,
  },
  {
    id: 2,
    icon: "fas fa-briefcase",
    category: "Kinh doanh",
    title: "Quản trị doanh nghiệp",
    description: "Kỹ năng quản trị và lãnh đạo hiệu quả.",
    duration: "8 giờ",
    students: 980,
    rating: 4.6,
    price: 149000,
  },
  {
    id: 3,
    icon: "fas fa-paint-brush",
    category: "Sáng tạo",
    title: "Thiết kế UI/UX",
    description: "Thiết kế giao diện người dùng chuyên nghiệp.",
    duration: "10 giờ",
    students: 860,
    rating: 4.7,
    price: 179000,
  },
];

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home popularCourses={sampleCourses} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/courses"
            element={<Courses courses={sampleCourses} />}
          />
          <Route path="/features" element={<Features />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
