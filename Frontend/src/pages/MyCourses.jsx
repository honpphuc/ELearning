import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyCourses = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập để xem khóa học của bạn");
        setEnrollments([]);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/enrollments/my-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể tải khóa học");
      const data = await res.json();
      setEnrollments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  // Cập nhật khi login/logout hoặc thay đổi token ở tab khác
  useEffect(() => {
    const handleUserLogin = () => fetchMyCourses();
    const handleUserLogout = () => {
      setEnrollments([]);
      setError("Vui lòng đăng nhập để xem khóa học của bạn");
    };
    const handleStorage = (e) => {
      if (e.key === "token") {
        if (e.newValue) fetchMyCourses();
        else handleUserLogout();
      }
      if (e.key === "logout") handleUserLogout();
    };

    window.addEventListener("userLogin", handleUserLogin);
    window.addEventListener("userLogout", handleUserLogout);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("userLogin", handleUserLogin);
      window.removeEventListener("userLogout", handleUserLogout);
      window.removeEventListener("storage", handleStorage);
    };
  }, [fetchMyCourses]);

  if (loading) {
    return (
      <section className="page-section">
        <div className="container">
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-section">
        <div className="container">
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link to="/login" className="btn btn-primary">
              <i className="fas fa-sign-in-alt"></i> Đăng nhập
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Ẩn các enrollment có courseId null (khóa học đã bị xóa)
  const visibleEnrollments = enrollments.filter((e) => e && e.courseId);

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-header">
          <h1 className="admin-title">
            <i className="fas fa-graduation-cap"></i> Khóa học của tôi
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "var(--muted)",
              marginTop: "0.5rem",
            }}
          >
            Bạn đã đăng ký {visibleEnrollments.length} khóa học
          </p>
        </div>

        {visibleEnrollments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <i
              className="fas fa-book-open"
              style={{
                fontSize: "4rem",
                color: "var(--muted)",
                marginBottom: "1rem",
              }}
            ></i>
            <h3 style={{ color: "var(--muted)" }}>
              Bạn chưa đăng ký khóa học nào
            </h3>
            <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
              Hãy khám phá và đăng ký các khóa học hấp dẫn!
            </p>
            <Link to="/courses" className="btn btn-primary">
              <i className="fas fa-search"></i> Khám phá khóa học
            </Link>
          </div>
        ) : (
          <div className="courses-grid">
            {visibleEnrollments.map((enrollment) => {
              const course = enrollment.courseId;
              const enrolledDate = enrollment?.enrolledAt
                ? new Date(enrollment.enrolledAt).toLocaleDateString("vi-VN")
                : "-";
              return (
                <div key={enrollment._id} className="course-card">
                  <div className="course-image">
                    <i className={course.icon || "fas fa-book"}></i>
                  </div>
                  <div className="course-content">
                    <span className="course-category">
                      {course.category || ""}
                    </span>
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">
                      {course.description || ""}
                    </p>
                    <div className="course-meta">
                      <span>
                        <i className="fas fa-clock"></i>{" "}
                        {course.duration || "Chưa cập nhật"}
                      </span>
                      <span>
                        <i className="fas fa-star"></i> {course.rating || 0}/5
                      </span>
                      <span>
                        <i className="fas fa-calendar"></i> Đăng ký:{" "}
                        {enrolledDate}
                      </span>
                    </div>
                    <div
                      style={{
                        background: enrollment.completed
                          ? "#d3f9d8"
                          : "#e7f5ff",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        marginTop: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span
                          style={{ fontWeight: "bold", color: "var(--text)" }}
                        >
                          Tiến độ:
                        </span>
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "var(--primary)",
                          }}
                        >
                          {enrollment.progress}%
                        </span>
                      </div>
                      <div
                        style={{
                          background: "#e8ecf1",
                          height: "8px",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            background: enrollment.completed
                              ? "#51cf66"
                              : "var(--primary)",
                            height: "100%",
                            width: `${enrollment.progress}%`,
                            transition: "width 0.3s",
                          }}
                        ></div>
                      </div>
                    </div>
                    <Link
                      to={`/learn/${course._id}`}
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      <i className="fas fa-play"></i> Tiếp tục học
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyCourses;
