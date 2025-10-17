import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

const LearnCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completedLessons, setCompletedLessons] = useState([]);

  // Thêm ref cho video overlay
  const mainVideoRef = useRef(null);
  const [videoOverlay, setVideoOverlay] = useState(false);

  useEffect(() => {
    checkEnrollmentAndFetchCourse();
  }, [id]);

  useEffect(() => {
    if (enrollment?.completedLessons) setCompletedLessons(enrollment.completedLessons);
  }, [enrollment]);

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
        `${API_URL}/enrollments/check/${id}`,
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
      const courseRes = await fetch(`${API_URL}/courses/${id}`);
      if (!courseRes.ok) throw new Error("Không tìm thấy khóa học");
      const courseData = await courseRes.json();
      setCourse(courseData);

      // Lấy thông tin enrollment để hiển thị progress
      const myCoursesRes = await fetch(
        `${API_URL}/enrollments/my-courses`,
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

  // Gọi API khi xem hết video bài học
  const handleLessonEnded = async (lessonId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_URL}/enrollments/complete-lesson`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: course._id, lessonId }),
      });
      const data = await res.json();
      if (data.success) {
        setCompletedLessons(data.completedLessons);
      }
    } catch {}
  };

  // Helper: Overlay che seekbar cho iframe (YouTube/Vimeo)
  const renderVideoWithNoSeek = (src, title = "Video khóa học") => (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: "#000", borderRadius: "8px" }}>
      <iframe
        ref={mainVideoRef}
        src={src}
        allowFullScreen={true}
        style={{ position: "absolute", width: "100%", height: "100%", left: 0, top: 0, border: 0, borderRadius: "8px" }}
        title={title}
      />
      {/* Overlay che seekbar (dưới cùng) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: "18%",
          background: "rgba(0,0,0,0.01)",
          zIndex: 10,
          cursor: "not-allowed",
        }}
        onClick={e => e.preventDefault()}
        onMouseDown={e => e.preventDefault()}
      ></div>
    </div>
  );

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
              {/* Video player nếu có videoUrl */}
              {course.videoUrl && (
                renderVideoWithNoSeek(
                  (() => {
                    if (course.videoUrl.includes("youtube.com") || course.videoUrl.includes("youtu.be")) {
                      const videoId = course.videoUrl.includes("youtube.com")
                        ? course.videoUrl.split("v=")[1]?.split("&")[0]
                        : course.videoUrl.split("youtu.be/")[1]?.split("?")[0];
                      return videoId ? `https://www.youtube.com/embed/${videoId}` : course.videoUrl;
                    }
                    if (course.videoUrl.includes("vimeo.com")) {
                      const videoId = course.videoUrl.split("vimeo.com/")[1]?.split("?")[0];
                      return videoId ? `https://player.vimeo.com/video/${videoId}` : course.videoUrl;
                    }
                    return course.videoUrl;
                  })(),
                  "Video khóa học"
                )
              )}

              {/* Danh sách bài học thực tế */}
              <h2 style={{ marginBottom: "1rem" }}>Nội dung khóa học ({course.lessonCount || (course.lessons?.length || 0)} bài học, {course.videoCount || (course.lessons?.filter(l=>l.videoUrl).length || 0)} video, {course.quizCount || (course.quizzes?.length || 0)} bài kiểm tra)</h2>
              <div style={{ marginBottom: "2rem" }}>
                {course.lessons && course.lessons.length > 0 ? (
                  course.lessons.map((lesson, idx) => (
                    <div key={idx} style={{ background: "#f8f9fb", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.5rem" }}>
                        <i className="fas fa-play-circle" style={{ color: "var(--primary)" }}></i>
                        <strong>Bài {idx + 1}: {lesson.title}</strong>
                        {lesson.duration && <span style={{ color: "#64748b", fontSize: "0.95em" }}>({lesson.duration})</span>}
                        {/* Dấu tích xanh nếu đã hoàn thành */}
                        {completedLessons?.includes?.(lesson._id) && (
                          <span style={{ color: "#22c55e", fontWeight: 600 }}><i className="fas fa-check-circle"></i></span>
                        )}
                      </div>
                      {lesson.videoUrl && (
                        <VideoWithEnded
                          src={(() => {
                            if (lesson.videoUrl.includes("youtube.com") || lesson.videoUrl.includes("youtu.be")) {
                              const videoId = lesson.videoUrl.includes("youtube.com")
                                ? lesson.videoUrl.split("v=")[1]?.split("&")[0]
                                : lesson.videoUrl.split("youtu.be/")[1]?.split("?")[0];
                              return videoId ? `https://www.youtube.com/embed/${videoId}` : lesson.videoUrl;
                            }
                            if (lesson.videoUrl.includes("vimeo.com")) {
                              const videoId = lesson.videoUrl.split("vimeo.com/")[1]?.split("?")[0];
                              return videoId ? `https://player.vimeo.com/video/${videoId}` : lesson.videoUrl;
                            }
                            return lesson.videoUrl;
                          })()}
                          title={`Video bài học ${idx + 1}`}
                          onEnded={() => handleLessonEnded(lesson._id)}
                        />
                      )}
                      {lesson.description && <div style={{ color: "#334155", fontSize: "0.98em" }}>{lesson.description}</div>}
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#64748b" }}>Chưa có bài học nào.</div>
                )}
              </div>

              {/* Danh sách bài kiểm tra */}
              <h2 style={{ marginBottom: "1rem" }}>Bài kiểm tra ({course.quizCount || (course.quizzes?.length || 0)})</h2>
              <div style={{ marginBottom: "2rem" }}>
                {course.quizzes && course.quizzes.length > 0 ? (
                  course.quizzes.map((quiz, idx) => (
                    <div key={idx} style={{ background: "#fefce8", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.5rem" }}>
                        <i className="fas fa-question-circle" style={{ color: "#f59e0b" }}></i>
                        <strong>Bài kiểm tra {idx + 1}: {quiz.title}</strong>
                        <span style={{ color: "#92400e", fontSize: "0.95em" }}>({quiz.questions?.length || 0} câu hỏi)</span>
                      </div>
                      {quiz.description && <div style={{ color: "#92400e", fontSize: "0.98em" }}>{quiz.description}</div>}
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#64748b" }}>Chưa có bài kiểm tra nào.</div>
                )}
              </div>

              <div
                className="course-form"
                style={{
                  padding: "2rem",
                  background: "white",
                  borderRadius: "12px",
                  marginBottom: "2rem",
                }}
              >
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
                {/* Danh sách bài học thực tế */}
                <div style={{ marginBottom: "1.5rem" }}>
                  {course.lessons && course.lessons.length > 0 ? (
                    course.lessons.map((lesson, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "1rem",
                          background: "#f8f9fb",
                          borderRadius: "8px",
                          marginBottom: "0.5rem",
                          border: "2px solid #e0e7ef",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <i className="fas fa-play-circle" style={{ color: "var(--primary)" }}></i>
                          <span style={{ fontWeight: 600 }}>Bài {idx + 1}: {lesson.title}</span>
                          {lesson.duration && <span style={{ color: "#64748b", fontSize: "0.95em" }}>({lesson.duration})</span>}
                        </span>
                        {/* Trạng thái hoàn thành (nếu có) */}
                        {enrollment?.completedLessons?.includes?.(lesson._id) ? (
                          <span style={{ color: "#22c55e", fontWeight: 600 }}><i className="fas fa-check-circle"></i> Đã học</span>
                        ) : (
                          <span style={{ color: "#64748b" }}><i className="fas fa-circle"></i></span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#64748b" }}>Chưa có bài học nào.</div>
                  )}
                </div>
                {/* Danh sách bài tập (quizzes) */}
                <h4 style={{ marginBottom: "0.7rem", marginTop: "1.5rem" }}>
                  <i className="fas fa-question-circle" style={{ color: "#f59e0b" }}></i> Bài tập
                </h4>
                <div>
                  {course.quizzes && course.quizzes.length > 0 ? (
                    course.quizzes.map((quiz, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "1rem",
                          background: "#fefce8",
                          borderRadius: "8px",
                          marginBottom: "0.5rem",
                          border: "2px solid #fde68a",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <i className="fas fa-question-circle" style={{ color: "#f59e0b" }}></i>
                          <span style={{ fontWeight: 600 }}>Quiz {idx + 1}: {quiz.title}</span>
                          <span style={{ color: "#92400e", fontSize: "0.95em" }}>({quiz.questions?.length || 0} câu hỏi)</span>
                        </span>
                        {/* Trạng thái hoàn thành (nếu có) */}
                        {enrollment?.completedQuizzes?.includes?.(quiz._id) ? (
                          <span style={{ color: "#22c55e", fontWeight: 600 }}><i className="fas fa-check-circle"></i> Đã làm</span>
                        ) : (
                          <span style={{ color: "#64748b" }}><i className="fas fa-circle"></i></span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#64748b" }}>Chưa có bài tập nào.</div>
                  )}
                </div>
                {/* Nút hoàn thành hoặc thông báo */}
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

// Component video có sự kiện ended (dùng cho YouTube/Vimeo embed)
const VideoWithEnded = ({ src, title, onEnded }) => {
  const iframeRef = useRef();
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    // Chỉ hỗ trợ YouTube
    if (src.includes("youtube.com") || src.includes("youtu.be")) {
      // Inject YouTube API
      const onYouTubeIframeAPIReady = () => {
        const player = new window.YT.Player(iframe, {
          events: {
            onStateChange: (event) => {
              if (event.data === 0) onEnded && onEnded(); // 0 = ended
            },
          },
        });
      };
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        document.body.appendChild(tag);
      } else {
        onYouTubeIframeAPIReady();
      }
    }
    // TODO: Vimeo support nếu cần
  }, [src, onEnded]);
  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: "#000", borderRadius: "8px" }}>
      <iframe
        ref={iframeRef}
        src={src}
        allowFullScreen={true}
        style={{ position: "absolute", width: "100%", height: "100%", left: 0, top: 0, border: 0, borderRadius: "8px" }}
        title={title}
      />
      {/* Overlay che seekbar (dưới cùng) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: "18%",
          background: "rgba(0,0,0,0.01)",
          zIndex: 10,
          cursor: "not-allowed",
        }}
        onClick={e => e.preventDefault()}
        onMouseDown={e => e.preventDefault()}
      ></div>
    </div>
  );
};

export default LearnCourse;
