import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/courses");
      if (!res.ok) throw new Error("Không thể tải khóa học");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Khóa học</h1>
          <p>Khám phá các khóa học phổ biến và mới nhất trên EduLearn.</p>
        </div>
      </section>

      <section className="courses">
        <div className="container">
          {loading && (
            <div className="loading" style={{ textAlign: 'center', padding: '3rem' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
              <p>Đang tải khóa học...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          {!loading && !error && courses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <i className="fas fa-inbox" style={{ fontSize: '4rem', color: 'var(--muted)', marginBottom: '1rem' }}></i>
              <h3 style={{ color: 'var(--muted)' }}>Chưa có khóa học nào</h3>
              <p style={{ color: 'var(--muted)' }}>Vui lòng quay lại sau.</p>
            </div>
          )}

          {!loading && !error && courses.length > 0 && (
            <div className="courses-grid">
              {courses.map((course) => (
                <div key={course._id} className="course-card">
                  <div className="course-image">
                    <i className={course.icon || "fas fa-book"}></i>
                  </div>
                  <div className="course-content">
                    <span className="course-category">{course.category || "Khóa học"}</span>
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">{course.description || "Mô tả khóa học"}</p>
                    <div className="course-meta">
                      <span>
                        <i className="fas fa-clock"></i> {course.duration || "Chưa cập nhật"}
                      </span>
                      <span>
                        <i className="fas fa-users"></i> {course.students || 0} học viên
                      </span>
                      <span>
                        <i className="fas fa-star"></i> {course.rating || 0}/5
                      </span>
                    </div>
                    <div className="course-price">
                      {course.price ? Number(course.price).toLocaleString("vi-VN") + "đ" : "Miễn phí"}
                    </div>
                    <div
                      className="course-actions"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Link
                        to={`/payment/${course._id}`}
                        className="btn btn-register"
                        style={{ padding: "10px 16px" }}
                      >
                        Đăng ký ngay
                      </Link>
                      <Link to={`/course/${course._id}`} className="btn btn-info">
                        <i className="fas fa-info-circle"></i> Chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Courses;
