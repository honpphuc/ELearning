import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const LearnCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkEnrollmentAndFetchCourse();
  }, [id]);

  const checkEnrollmentAndFetchCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập để học!");
        navigate("/login");
        return;
      }

      setLoading(true);

      // Kiểm tra đăng ký
      const enrollRes = await fetch(
        `http://localhost:5000/api/enrollments/check/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const enrollData = await enrollRes.json();

      if (!enrollData.enrolled) {
        alert("Bạn chưa đăng ký khóa học này!");
        navigate(`/payment/${id}`);
        return;
      }

      // Lấy thông tin khóa học
      const courseRes = await fetch(`http://localhost:5000/api/courses/${id}`);
      if (!courseRes.ok) throw new Error("Không tìm thấy khóa học");
      const courseData = await courseRes.json();
      setCourse(courseData);

      // Lấy thông tin enrollment để hiển thị progress
      const myCoursesRes = await fetch(
        "http://localhost:5000/api/enrollments/my-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const myCoursesData = await myCoursesRes.json();
      const currentEnrollment = myCoursesData.find(
        (e) => e.courseId._id === id
      );
      setEnrollment(currentEnrollment);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (error || !course) {
    return (
      <section className="page-section">
        <div className="container">
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i>{" "}
            {error || "Không tìm thấy khóa học"}
          </div>
          <Link to="/my-courses" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Quay lại khóa học của tôi
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Header Bar */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #e1e8ed",
          padding: "1rem 0",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link to="/my-courses" style={{ color: "var(--primary)" }}>
                <i className="fas fa-arrow-left"></i> Khóa học của tôi
              </Link>
              <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{course.title}</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
              <div>
                <small style={{ color: "var(--muted)" }}>Tiến độ</small>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "150px",
                      height: "8px",
                      background: "#e1e8ed",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${enrollment?.progress || 0}%`,
                        height: "100%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        transition: "width 0.3s",
                      }}
                    ></div>
                  </div>
                  <strong>{enrollment?.progress || 0}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="page-section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
            {/* Video/Content Area */}
            <div>
              <div
                className="course-form"
                style={{
                  padding: "2rem",
                  background: "white",
                  borderRadius: "12px",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "8px",
                    padding: "3rem",
                    textAlign: "center",
                    color: "white",
                    marginBottom: "2rem",
                  }}
                >
                  <i
                    className="fas fa-play-circle"
                    style={{ fontSize: "4rem", marginBottom: "1rem" }}
                  ></i>
                  <h3>Video bài giảng</h3>
                  <p style={{ opacity: 0.9 }}>
                    Tính năng video đang được phát triển
                  </p>
                </div>

                <h2 style={{ marginBottom: "1rem" }}>Nội dung khóa học</h2>
                <p style={{ color: "var(--text)", lineHeight: "1.6" }}>
                  {course.description}
                </p>
              </div>

              {/* Course Details */}
              <div
                className="course-form"
                style={{ padding: "2rem", background: "white", borderRadius: "12px" }}
              >
                <h3 style={{ marginBottom: "1.5rem" }}>
                  <i className="fas fa-info-circle"></i> Thông tin khóa học
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1rem",
                  }}
                >
                  <div style={{ padding: "1rem", background: "#f8f9fb", borderRadius: "8px" }}>
                    <i
                      className="fas fa-video"
                      style={{ color: "var(--primary)", marginRight: "0.5rem" }}
                    ></i>
                    <strong>Bài giảng:</strong> {course.lectures || 0}
                  </div>
                  <div style={{ padding: "1rem", background: "#f8f9fb", borderRadius: "8px" }}>
                    <i
                      className="fas fa-file-alt"
                      style={{ color: "var(--primary)", marginRight: "0.5rem" }}
                    ></i>
                    <strong>Bài tập:</strong> {course.exercises || 0}
                  </div>
                  <div style={{ padding: "1rem", background: "#f8f9fb", borderRadius: "8px" }}>
                    <i
                      className="fas fa-clock"
                      style={{ color: "var(--primary)", marginRight: "0.5rem" }}
                    ></i>
                    <strong>Thời lượng:</strong> {course.duration || "N/A"}
                  </div>
                  <div style={{ padding: "1rem", background: "#f8f9fb", borderRadius: "8px" }}>
                    <i
                      className="fas fa-layer-group"
                      style={{ color: "var(--primary)", marginRight: "0.5rem" }}
                    ></i>
                    <strong>Cấp độ:</strong> {course.level || "N/A"}
                  </div>
                  {course.instructor && (
                    <div
                      style={{
                        padding: "1rem",
                        background: "#f8f9fb",
                        borderRadius: "8px",
                        gridColumn: "1 / -1",
                      }}
                    >
                      <i
                        className="fas fa-chalkboard-teacher"
                        style={{ color: "var(--primary)", marginRight: "0.5rem" }}
                      ></i>
                      <strong>Giảng viên:</strong> {course.instructor}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div
                className="course-form"
                style={{ padding: "1.5rem", background: "white", borderRadius: "12px" }}
              >
                <h3 style={{ marginBottom: "1rem" }}>
                  <i className="fas fa-list"></i> Nội dung bài học
                </h3>
                <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
                  Danh sách các bài học sẽ được cập nhật sớm
                </p>

                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      padding: "1rem",
                      background: "#f8f9fb",
                      borderRadius: "8px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        <i className="fas fa-play-circle" style={{ color: "var(--primary)" }}></i>{" "}
                        Bài 1: Giới thiệu
                      </span>
                      <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                        15 phút
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "1rem",
                      background: "#f8f9fb",
                      borderRadius: "8px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        <i className="fas fa-lock" style={{ color: "var(--muted)" }}></i> Bài 2:
                        Cài đặt
                      </span>
                      <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                        20 phút
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "1rem",
                      background: "#f8f9fb",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        <i className="fas fa-lock" style={{ color: "var(--muted)" }}></i> Bài 3:
                        Thực hành
                      </span>
                      <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                        30 phút
                      </span>
                    </div>
                  </div>
                </div>

                {enrollment?.completed ? (
                  <div
                    className="alert"
                    style={{
                      background: "#d4edda",
                      color: "#155724",
                      padding: "1rem",
                      borderRadius: "8px",
                      marginTop: "1rem",
                    }}
                  >
                    <i className="fas fa-check-circle"></i> Bạn đã hoàn thành khóa học!
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "1rem" }}
                    onClick={() => alert("Tính năng đánh dấu hoàn thành đang phát triển")}
                  >
                    <i className="fas fa-check"></i> Đánh dấu hoàn thành
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnCourse;
