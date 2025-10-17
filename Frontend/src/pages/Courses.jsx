import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollments, setEnrollments] = useState([]); // Lưu toàn bộ enrollment data
  const [filter, setFilter] = useState("all"); // "all", "in-progress", "completed"
  const token = localStorage.getItem("token");

  // Fetch functions
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/courses`);
      if (!res.ok) throw new Error("Không thể tải khóa học");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEnrolledCourses = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/enrollments/my-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data);
      }
    } catch (err) {
      console.error("Lỗi khi tải khóa học đã đăng ký:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchCourses();
    if (token) {
      fetchEnrolledCourses();
    } else {
      setEnrollments([]);
    }
  }, [fetchCourses, fetchEnrolledCourses, token]);

  // Cập nhật danh sách đăng ký khi user đăng nhập/đăng xuất hoặc token thay đổi ở tab khác
  useEffect(() => {
    const handleUserLogin = () => {
      const t = localStorage.getItem("token");
      if (t) fetchEnrolledCourses();
    };
    const handleUserLogout = () => setEnrollments([]);
    const handleStorage = (e) => {
      if (e.key === "token") {
        if (e.newValue) fetchEnrolledCourses();
        else setEnrollments([]);
      }
      if (e.key === "logout") {
        setEnrollments([]);
      }
    };

    window.addEventListener("userLogin", handleUserLogin);
    window.addEventListener("userLogout", handleUserLogout);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("userLogin", handleUserLogin);
      window.removeEventListener("userLogout", handleUserLogout);
      window.removeEventListener("storage", handleStorage);
    };
  }, [fetchEnrolledCourses]);

  const getEnrollment = (courseId) => {
    return enrollments.find((e) => {
      if (!e || !e.courseId) return false;
      const cid = e.courseId._id || e.courseId;
      return cid === courseId;
    });
  };

  const isEnrolled = (courseId) => !!getEnrollment(courseId);

  const isCompleted = (courseId) => {
    const enrollment = getEnrollment(courseId);
    return enrollment?.completed || false;
  };

  const getFilteredCourses = () => {
    if (filter === "in-progress") {
      return courses.filter(
        (course) => isEnrolled(course._id) && !isCompleted(course._id)
      );
    }
    if (filter === "completed") {
      return courses.filter((course) => isCompleted(course._id));
    }
    return courses; // "all"
  };

  const filteredCourses = getFilteredCourses();

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
          {/* Bộ lọc */}
          {token && enrollments.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                marginBottom: "2rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setFilter("all")}
                className={`btn ${
                  filter === "all" ? "btn-primary" : "btn-outline"
                }`}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "25px",
                  background:
                    filter === "all"
                      ? "linear-gradient(135deg, #3b82f6, #1e40af)"
                      : "white",
                  color: filter === "all" ? "#fff" : "#1e40af",
                  border: "2px solid var(--primary)",
                  fontWeight: "600",
                  transition: "all 0.3s",
                  boxShadow:
                    filter === "all"
                      ? "0 4px 12px rgba(59, 130, 246, 0.18)"
                      : "none",
                  transform: filter === "all" ? "translateY(-2px)" : "none",
                  textShadow:
                    filter === "all"
                      ? "0 1px 2px rgba(30,64,175,0.18)"
                      : "none",
                }}
              >
                <i className="fas fa-th"></i> Tất cả ({courses.length})
              </button>
              <button
                onClick={() => setFilter("in-progress")}
                className={`btn ${
                  filter === "in-progress" ? "btn-success" : "btn-outline"
                }`}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "25px",
                  background:
                    filter === "in-progress"
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "white",
                  color: filter === "in-progress" ? "#fff" : "#059669",
                  border: "2px solid #10b981",
                  fontWeight: "600",
                  transition: "all 0.3s",
                  boxShadow:
                    filter === "in-progress"
                      ? "0 4px 12px rgba(16, 185, 129, 0.18)"
                      : "none",
                  transform:
                    filter === "in-progress" ? "translateY(-2px)" : "none",
                  textShadow:
                    filter === "in-progress"
                      ? "0 1px 2px rgba(5,150,105,0.18)"
                      : "none",
                }}
              >
                <i className="fas fa-play-circle"></i> Đang học (
                {enrollments.filter((e) => !e.completed).length})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`btn ${
                  filter === "completed" ? "btn-warning" : "btn-outline"
                }`}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "25px",
                  background:
                    filter === "completed"
                      ? "linear-gradient(135deg, #f59e0b, #d97706)"
                      : "white",
                  color: filter === "completed" ? "#fff" : "#d97706",
                  border: "2px solid #f59e0b",
                  fontWeight: "600",
                  transition: "all 0.3s",
                  boxShadow:
                    filter === "completed"
                      ? "0 4px 12px rgba(245, 158, 11, 0.18)"
                      : "none",
                  transform:
                    filter === "completed" ? "translateY(-2px)" : "none",
                  textShadow:
                    filter === "completed"
                      ? "0 1px 2px rgba(217,119,6,0.18)"
                      : "none",
                }}
              >
                <i className="fas fa-check-double"></i> Đã hoàn thành (
                {enrollments.filter((e) => e.completed).length})
              </button>
            </div>
          )}

          {loading && (
            <div
              className="loading"
              style={{ textAlign: "center", padding: "3rem" }}
            >
              <i
                className="fas fa-spinner fa-spin"
                style={{ fontSize: "3rem", color: "var(--primary)" }}
              ></i>
              <p>Đang tải khóa học...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          {!loading && !error && courses.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <i
                className="fas fa-inbox"
                style={{
                  fontSize: "4rem",
                  color: "var(--muted)",
                  marginBottom: "1rem",
                }}
              ></i>
              <h3 style={{ color: "var(--muted)" }}>Chưa có khóa học nào</h3>
              <p style={{ color: "var(--muted)" }}>Vui lòng quay lại sau.</p>
            </div>
          )}

          {!loading &&
            !error &&
            filteredCourses.length === 0 &&
            courses.length > 0 && (
              <div style={{ textAlign: "center", padding: "4rem" }}>
                <i
                  className="fas fa-filter"
                  style={{
                    fontSize: "4rem",
                    color: "var(--muted)",
                    marginBottom: "1rem",
                  }}
                ></i>
                <h3 style={{ color: "var(--muted)" }}>
                  Không tìm thấy khóa học
                </h3>
                <p style={{ color: "var(--muted)" }}>
                  {filter === "in-progress" &&
                    "Bạn chưa có khóa học nào đang học."}
                  {filter === "completed" &&
                    "Bạn chưa hoàn thành khóa học nào."}
                </p>
              </div>
            )}

          {!loading && !error && filteredCourses.length > 0 && (
            <div className="courses-grid">
              {filteredCourses.map((course) => {
                const enrollment = getEnrollment(course._id);
                return (
                  <div key={course._id} className="course-card">
                    <div className="course-image">
                      <i className={course.icon || "fas fa-book"}></i>
                    </div>
                    <div className="course-content">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span className="course-category">
                          {course.category || "Khóa học"}
                        </span>
                        {enrollment && (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.25rem 0.6rem",
                              borderRadius: "12px",
                              background: enrollment.completed
                                ? "#fef3c7"
                                : "#dbeafe",
                              color: enrollment.completed
                                ? "#92400e"
                                : "#1e40af",
                              fontWeight: "600",
                            }}
                          >
                            {enrollment.completed ? (
                              <>
                                <i className="fas fa-check-double"></i> Hoàn
                                thành
                              </>
                            ) : (
                              <>
                                <i className="fas fa-play-circle"></i>{" "}
                                {enrollment.progress || 0}%
                              </>
                            )}
                          </span>
                        )}
                      </div>
                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-description">
                        {course.description || "Mô tả khóa học"}
                      </p>
                      <div className="course-meta">
                        <span>
                          <i className="fas fa-clock"></i>{" "}
                          {course.duration || "Chưa cập nhật"}
                        </span>
                        <span>
                          <i className="fas fa-users"></i>{" "}
                          {course.students || 0} học viên
                        </span>
                        <span>
                          <i className="fas fa-star"></i> {course.rating || 0}/5
                        </span>
                      </div>
                      <div className="course-price">
                        {course.price
                          ? Number(course.price).toLocaleString("vi-VN") + "đ"
                          : "Miễn phí"}
                      </div>
                      <div
                        className="course-actions"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {isEnrolled(course._id) ? (
                          <Link
                            to={`/learn/${course._id}`}
                            className="btn btn-success"
                            style={{
                              padding: "10px 16px",
                              background: "#10b981",
                              flex: 1,
                              marginRight: "0.5rem",
                            }}
                          >
                            <i className="fas fa-play-circle"></i> Học ngay
                          </Link>
                        ) : (
                          <Link
                            to={`/payment/${course._id}`}
                            className="btn btn-register"
                            style={{ padding: "10px 16px" }}
                          >
                            Đăng ký ngay
                          </Link>
                        )}
                        <Link
                          to={`/course/${course._id}`}
                          className="btn btn-info"
                        >
                          <i className="fas fa-info-circle"></i> Chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
export default Courses;
