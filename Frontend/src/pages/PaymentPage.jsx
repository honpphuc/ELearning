import React from "react";
import { useParams } from "react-router-dom";
import Payment from "./Payment";

// Dữ liệu mẫu khóa học (nên lấy từ API hoặc context)
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

const PaymentPage = () => {
  const { id } = useParams();
  const course = sampleCourses.find((c) => String(c.id) === String(id));

  if (!course) {
    return (
      <div className="payment-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>Không tìm thấy khóa học!</p>
      </div>
    );
  }

  return <Payment course={course} />;
};

export default PaymentPage;
