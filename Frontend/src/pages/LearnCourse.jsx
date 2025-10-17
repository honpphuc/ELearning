import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [expandedQuizzes, setExpandedQuizzes] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({}); // { [quizKey]: { [qIdx]: optIdx } }

  const selectAnswer = (quizKey, qIdx, optIdx) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [quizKey]: { ...(prev[quizKey] || {}), [qIdx]: optIdx },
    }));
  };

  // Thêm ref cho video overlay
  const mainVideoRef = useRef(null);
  // Overlay is static; no local state needed

  // Chuẩn hoá URL YouTube để dùng IFrame API ổn định (tránh lỗi postMessage/timedtext)
  const buildYouTubeEmbed = (rawUrlOrId) => {
    try {
      const raw = String(rawUrlOrId || "");
      let videoId = null;
      // Nếu đã là URL dạng embed thì tách id từ /embed/<id>
      const embedMatch = raw.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
      if (embedMatch) {
        videoId = embedMatch[1];
      }
      if (
        !videoId &&
        (raw.includes("youtube.com") || raw.includes("youtu.be"))
      ) {
        // URL dạng watch hoặc youtu.be
        if (raw.includes("youtube.com")) {
          const v = raw.split("v=")[1]?.split("&")[0];
          videoId = v || null;
        } else if (raw.includes("youtu.be/")) {
          const v = raw.split("youtu.be/")[1]?.split("?")[0];
          videoId = v || null;
        }
      }
      if (!videoId && /^[a-zA-Z0-9_-]{6,}$/.test(raw)) {
        // Người dùng truyền thẳng id
        videoId = raw;
      }
      if (!videoId) return rawUrlOrId; // fallback

      const base = `https://www.youtube.com/embed/${videoId}`;
      const origin = encodeURIComponent(window.location.origin);
      // Bật JS API + hạn chế caption tự động để giảm gọi timedtext
      const params = `enablejsapi=1&origin=${origin}&modestbranding=1&rel=0&iv_load_policy=3&cc_load_policy=0&playsinline=1`;
      return `${base}?${params}`;
    } catch {
      return rawUrlOrId;
    }
  };

  const checkEnrollmentAndFetchCourse = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập để học!");
        navigate("/login");
        return;
      }

      setLoading(true);

      // Kiểm tra đăng ký
      const enrollRes = await fetch(`${API_URL}/enrollments/check/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const myCoursesRes = await fetch(`${API_URL}/enrollments/my-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const myCoursesData = await myCoursesRes.json();
      const currentEnrollment = myCoursesData.find(
        (e) => e.courseId._id === id
      );
      setEnrollment(currentEnrollment);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    checkEnrollmentAndFetchCourse();
  }, [checkEnrollmentAndFetchCourse]);

  useEffect(() => {
    if (enrollment?.completedLessons)
      setCompletedLessons(enrollment.completedLessons);
  }, [enrollment]);

  // End checkEnrollmentAndFetchCourse

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
        setCompletedLessons(data.completedLessons || []);
        setEnrollment((prev) => ({
          ...(prev || {}),
          completedLessons:
            data.completedLessons || prev?.completedLessons || [],
          progress:
            typeof data.progress === "number" ? data.progress : prev?.progress,
          completed:
            typeof data.completed === "boolean"
              ? data.completed
              : prev?.completed,
        }));
      }
    } catch (e) {
      console.error("complete-lesson failed", e);
    }
  };

  // Đánh dấu hoàn thành bài kiểm tra
  const handleCompleteQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !course?._id) return;
      const res = await fetch(`${API_URL}/enrollments/complete-quiz`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: course._id, quizId }),
      });
      const data = await res.json();
      if (data.success) {
        setEnrollment((prev) => ({
          ...(prev || {}),
          completedQuizzes:
            data.completedQuizzes || prev?.completedQuizzes || [],
          progress:
            typeof data.progress === "number" ? data.progress : prev?.progress,
          completed:
            typeof data.completed === "boolean"
              ? data.completed
              : prev?.completed,
        }));
      } else {
        alert(data.message || "Không thể đánh dấu hoàn thành bài tập");
      }
    } catch (e) {
      console.error("complete-quiz failed", e);
    }
  };

  // Đánh dấu hoàn thành toàn khoá (nếu muốn dùng nút tay, có thể thêm lại)

  // Helper: Overlay che seekbar cho iframe (YouTube/Vimeo)
  const renderVideoWithNoSeek = (src, title = "Video khóa học") => (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        background: "#000",
        borderRadius: "8px",
      }}
    >
      <iframe
        ref={mainVideoRef}
        src={src}
        allowFullScreen={true}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          border: 0,
          borderRadius: "8px",
        }}
        title={title}
      />
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
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "2rem",
            }}
          >
            {/* Video/Content Area */}
            <div>
              {/* Video player nếu có videoUrl */}
              {course.videoUrl &&
                renderVideoWithNoSeek(
                  (() => {
                    if (course.videoUrl.includes("vimeo.com")) {
                      const videoId = course.videoUrl
                        .split("vimeo.com/")[1]
                        ?.split("?")[0];
                      return videoId
                        ? `https://player.vimeo.com/video/${videoId}`
                        : course.videoUrl;
                    }
                    // Mặc định xử lý như YouTube (hoặc trả về nguyên bản nếu không nhận diện được)
                    return buildYouTubeEmbed(course.videoUrl);
                  })(),
                  "Video khóa học"
                )}

              {/* Danh sách bài học thực tế */}
              <h2 style={{ marginBottom: "1rem" }}>
                Nội dung khóa học (
                {course.lessonCount || course.lessons?.length || 0} bài học,{" "}
                {course.videoCount ||
                  course.lessons?.filter((l) => l.videoUrl).length ||
                  0}{" "}
                video, {course.quizCount || course.quizzes?.length || 0} bài
                kiểm tra)
              </h2>
              <div style={{ marginBottom: "2rem" }}>
                {course.lessons && course.lessons.length > 0 ? (
                  course.lessons.map((lesson, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#f8f9fb",
                        borderRadius: "8px",
                        padding: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.7rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <i
                          className="fas fa-play-circle"
                          style={{ color: "var(--primary)" }}
                        ></i>
                        <strong>
                          Bài {idx + 1}: {lesson.title}
                        </strong>
                        {lesson.duration && (
                          <span
                            style={{ color: "#64748b", fontSize: "0.95em" }}
                          >
                            ({lesson.duration})
                          </span>
                        )}
                        {/* Dấu tích xanh nếu đã hoàn thành */}
                        {completedLessons?.includes?.(lesson._id) && (
                          <span style={{ color: "#22c55e", fontWeight: 600 }}>
                            <i className="fas fa-check-circle"></i>
                          </span>
                        )}
                      </div>
                      {lesson.videoUrl && (
                        <VideoWithEnded
                          src={(() => {
                            if (lesson.videoUrl.includes("vimeo.com")) {
                              const videoId = lesson.videoUrl
                                .split("vimeo.com/")[1]
                                ?.split("?")[0];
                              return videoId
                                ? `https://player.vimeo.com/video/${videoId}`
                                : lesson.videoUrl;
                            }
                            return buildYouTubeEmbed(lesson.videoUrl);
                          })()}
                          title={`Video bài học ${idx + 1}`}
                          onEnded={() => handleLessonEnded(lesson._id)}
                        />
                      )}
                      {lesson.description && (
                        <div style={{ color: "#334155", fontSize: "0.98em" }}>
                          {lesson.description}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#64748b" }}>Chưa có bài học nào.</div>
                )}
              </div>

              {/* Danh sách bài kiểm tra */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <h2 style={{ margin: 0 }}>
                  Bài kiểm tra (
                  {course.quizCount || course.quizzes?.length || 0})
                </h2>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={checkEnrollmentAndFetchCourse}
                  title="Làm mới danh sách bài kiểm tra"
                >
                  <i className="fas fa-sync"></i> Làm mới
                </button>
              </div>
              <div style={{ marginBottom: "2rem" }}>
                {course.quizzes && course.quizzes.length > 0 ? (
                  course.quizzes.map((quiz, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#fefce8",
                        borderRadius: "8px",
                        padding: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.7rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <i
                          className="fas fa-question-circle"
                          style={{ color: "#f59e0b" }}
                        ></i>
                        <strong>
                          Bài kiểm tra {idx + 1}: {quiz.title}
                        </strong>
                        <span style={{ color: "#92400e", fontSize: "0.95em" }}>
                          ({quiz.questions?.length || 0} câu hỏi)
                        </span>
                        <button
                          className="btn btn-sm btn-outline"
                          style={{ marginLeft: "auto" }}
                          onClick={() =>
                            setExpandedQuizzes((prev) => ({
                              ...prev,
                              [quiz._id || idx]: !prev[quiz._id || idx],
                            }))
                          }
                        >
                          {expandedQuizzes[quiz._id || idx] ? (
                            <>
                              <i className="fas fa-eye-slash"></i> Thu gọn
                            </>
                          ) : (
                            <>
                              <i className="fas fa-eye"></i> Xem câu hỏi
                            </>
                          )}
                        </button>
                      </div>
                      {quiz.description && (
                        <div style={{ color: "#92400e", fontSize: "0.98em" }}>
                          {quiz.description}
                        </div>
                      )}
                      {expandedQuizzes[quiz._id || idx] && (
                        <div
                          style={{
                            marginTop: "0.75rem",
                            background: "#fff7db",
                            borderRadius: 8,
                            padding: "0.75rem",
                          }}
                        >
                          {quiz.questions && quiz.questions.length > 0 ? (
                            quiz.questions.map((q, qIdx) => {
                              const quizKey = quiz._id || idx;
                              const selected = quizAnswers[quizKey]?.[qIdx];
                              const isAnswered = typeof selected === "number";
                              return (
                                <div
                                  key={qIdx}
                                  style={{ marginBottom: "0.75rem" }}
                                >
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      marginBottom: "0.5rem",
                                      color: "#7a5a00",
                                    }}
                                  >
                                    Câu {qIdx + 1}: {q.question}
                                  </div>
                                  {q.options && q.options.length > 0 && (
                                    <ul
                                      style={{
                                        listStyle: "none",
                                        margin: 0,
                                        padding: 0,
                                      }}
                                    >
                                      {q.options.map((opt, optIdx) => {
                                        const isCorrect =
                                          optIdx === q.correctAnswer;
                                        const isSelected =
                                          isAnswered && optIdx === selected;
                                        const showResult = isAnswered; // chỉ hiện kết quả sau khi chọn
                                        let bg = "transparent";
                                        let border = "2px solid #e8ecf1";
                                        let color = "#1f2937";
                                        if (showResult) {
                                          if (isCorrect) {
                                            bg = "#d1fae5"; // xanh nhạt
                                            border = "2px solid #10b981";
                                          }
                                          if (isSelected && !isCorrect) {
                                            bg = "#fee2e2"; // đỏ nhạt
                                            border = "2px solid #ef4444";
                                          }
                                        } else if (isSelected) {
                                          border = "2px solid #6366f1";
                                        }
                                        return (
                                          <li
                                            key={optIdx}
                                            style={{ marginBottom: "0.5rem" }}
                                          >
                                            <button
                                              type="button"
                                              onClick={() =>
                                                selectAnswer(
                                                  quizKey,
                                                  qIdx,
                                                  optIdx
                                                )
                                              }
                                              style={{
                                                width: "100%",
                                                textAlign: "left",
                                                background: bg,
                                                border,
                                                borderRadius: 8,
                                                padding: "0.6rem 0.75rem",
                                                cursor: "pointer",
                                                color,
                                              }}
                                            >
                                              <strong
                                                style={{ marginRight: 8 }}
                                              >
                                                {String.fromCharCode(
                                                  65 + optIdx
                                                )}
                                                .
                                              </strong>
                                              {opt}
                                            </button>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                  {isAnswered && (
                                    <div
                                      style={{
                                        marginTop: "0.5rem",
                                        color:
                                          selected === q.correctAnswer
                                            ? "#065f46"
                                            : "#991b1b",
                                      }}
                                    >
                                      {selected === q.correctAnswer ? (
                                        "Đúng!"
                                      ) : (
                                        <>
                                          Sai. Đáp án đúng là{" "}
                                          {String.fromCharCode(
                                            65 + (q.correctAnswer ?? 0)
                                          )}
                                          .
                                        </>
                                      )}
                                      {q.explanation && (
                                        <div
                                          style={{
                                            marginTop: 4,
                                            color: "#7a5a00",
                                          }}
                                        >
                                          Giải thích: {q.explanation}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div style={{ color: "#7a5a00" }}>
                              Chưa có câu hỏi trong bài kiểm tra này.
                            </div>
                          )}
                        </div>
                      )}
                      {/* Nút đánh dấu hoàn thành bài tập (tạm thời) */}
                      {!enrollment?.completedQuizzes?.includes?.(quiz._id) && (
                        <div style={{ marginTop: "0.75rem" }}>
                          <button
                            className="btn btn-outline"
                            onClick={() => handleCompleteQuiz(quiz._id)}
                          >
                            <i className="fas fa-check"></i> Đánh dấu đã làm bài
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#64748b" }}>
                    Chưa có bài kiểm tra nào.
                  </div>
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
                style={{
                  padding: "2rem",
                  background: "white",
                  borderRadius: "12px",
                }}
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
                  <div
                    style={{
                      padding: "1rem",
                      background: "#f8f9fb",
                      borderRadius: "8px",
                    }}
                  >
                    <i
                      className="fas fa-video"
                      style={{ color: "var(--primary)", marginRight: "0.5rem" }}
                    ></i>
                    <strong>Bài giảng:</strong> {course.lectures || 0}
                  </div>
                  <div
                    style={{
                      padding: "1rem",
                      background: "#f8f9fb",
                      borderRadius: "8px",
                    }}
                  >
                    <i
                      className="fas fa-file-alt"
                      style={{ color: "var(--primary)", marginRight: "0.5rem" }}
                    ></i>
                    <strong>Bài tập:</strong> {course.exercises || 0}
                  </div>
                  <div
                    style={{
                      padding: "1rem",
                      background: "#f8f9fb",
                      borderRadius: "8px",
                    }}
                  >
                    <i
                      className="fas fa-clock"
                      style={{ color: "var(--primary)", marginRight: "0.5rem" }}
                    ></i>
                    <strong>Thời lượng:</strong> {course.duration || "N/A"}
                  </div>
                  <div
                    style={{
                      padding: "1rem",
                      background: "#f8f9fb",
                      borderRadius: "8px",
                    }}
                  >
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
                        style={{
                          color: "var(--primary)",
                          marginRight: "0.5rem",
                        }}
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
                style={{
                  padding: "1.5rem",
                  background: "white",
                  borderRadius: "12px",
                }}
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
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <i
                            className="fas fa-play-circle"
                            style={{ color: "var(--primary)" }}
                          ></i>
                          <span style={{ fontWeight: 600 }}>
                            Bài {idx + 1}: {lesson.title}
                          </span>
                          {lesson.duration && (
                            <span
                              style={{ color: "#64748b", fontSize: "0.95em" }}
                            >
                              ({lesson.duration})
                            </span>
                          )}
                        </span>
                        {/* Trạng thái hoàn thành (nếu có) */}
                        {enrollment?.completedLessons?.includes?.(
                          lesson._id
                        ) ? (
                          <span style={{ color: "#22c55e", fontWeight: 600 }}>
                            <i className="fas fa-check-circle"></i> Đã học
                          </span>
                        ) : (
                          <span style={{ color: "#64748b" }}>
                            <i className="fas fa-circle"></i>
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#64748b" }}>Chưa có bài học nào.</div>
                  )}
                </div>
                {/* Danh sách bài tập (quizzes) */}
                <h4 style={{ marginBottom: "0.7rem", marginTop: "1.5rem" }}>
                  <i
                    className="fas fa-question-circle"
                    style={{ color: "#f59e0b" }}
                  ></i>{" "}
                  Bài tập
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
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <i
                            className="fas fa-question-circle"
                            style={{ color: "#f59e0b" }}
                          ></i>
                          <span style={{ fontWeight: 600 }}>
                            Quiz {idx + 1}: {quiz.title}
                          </span>
                          <span
                            style={{ color: "#92400e", fontSize: "0.95em" }}
                          >
                            ({quiz.questions?.length || 0} câu hỏi)
                          </span>
                        </span>
                        {/* Trạng thái hoàn thành (nếu có) */}
                        {enrollment?.completedQuizzes?.includes?.(quiz._id) ? (
                          <span style={{ color: "#22c55e", fontWeight: 600 }}>
                            <i className="fas fa-check-circle"></i> Đã làm
                          </span>
                        ) : (
                          <span style={{ color: "#64748b" }}>
                            <i className="fas fa-circle"></i>
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#64748b" }}>Chưa có bài tập nào.</div>
                  )}
                </div>
                {/* Trạng thái hoàn thành tự động */}
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
                    <i className="fas fa-check-circle"></i> Bạn đã hoàn thành
                    khóa học!
                  </div>
                ) : (
                  <div
                    className="alert"
                    style={{
                      background: "#fff8e1",
                      color: "#7a5a00",
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      marginTop: "1rem",
                    }}
                  >
                    Hoàn thành khóa học khi bạn đã học xong tất cả bài học và
                    làm xong tất cả bài tập.
                  </div>
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
        new window.YT.Player(iframe, {
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
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        background: "#000",
        borderRadius: "8px",
      }}
    >
      <iframe
        ref={iframeRef}
        src={src}
        allowFullScreen={true}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          border: 0,
          borderRadius: "8px",
        }}
        title={title}
      />
    </div>
  );
};

export default LearnCourse;
