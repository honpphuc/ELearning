import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getCourseById,
  checkEnrollment,
  getMyEnrollments,
  completeLesson,
  completeQuiz,
} from "./apiService";

const LearnCourse = () => {
  // State cho lesson/quiz được chọn (sửa lỗi cú pháp)
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
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
      const enrollData = await checkEnrollment(id);
      if (!enrollData.enrolled) {
        alert("Bạn chưa đăng ký khóa học này!");
        navigate(`/payment/${id}`);
        return;
      }

      const courseData = await getCourseById(id);
      setCourse(courseData);

      // Lấy thông tin enrollment để hiển thị progress
      const myCoursesData = await getMyEnrollments();
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
      const data = await completeLesson(course._id, lessonId);
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
      if (!token || !course?._id) return;
      const data = await completeQuiz(course._id, quizId);
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
      {/* Header Bar giữ nguyên */}
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
        {/* ...existing code... */}
      </div>
      <section className="page-section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
            {/* Nội dung chính: video hoặc quiz */}
            <div>
              {selectedLesson !== null && course.lessons && course.lessons[selectedLesson] && (
                <div style={{ marginBottom: "2rem" }}>
                  <h2>Bài {selectedLesson + 1}: {course.lessons[selectedLesson].title}</h2>
                  {course.lessons[selectedLesson].videoUrl && renderVideoWithNoSeek(
                    buildYouTubeEmbed(course.lessons[selectedLesson].videoUrl),
                    `Video bài học ${selectedLesson + 1}`
                  )}
                  <div style={{ marginTop: "1rem", color: "#334155" }}>
                    {course.lessons[selectedLesson].description}
                  </div>
                  {/* Nút đánh dấu hoàn thành */}
                  <div style={{ marginTop: "1rem" }}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleLessonEnded(course.lessons[selectedLesson]._id)}
                      disabled={completedLessons?.includes?.(course.lessons[selectedLesson]._id)}
                      style={{ cursor: completedLessons?.includes?.(course.lessons[selectedLesson]._id) ? 'not-allowed' : 'pointer' }}
                    >
                      {completedLessons?.includes?.(course.lessons[selectedLesson]._id) ? (
                        <><i className="fas fa-check-circle"></i> Đã hoàn thành</>
                      ) : (
                        <><i className="fas fa-check"></i> Đánh dấu đã hoàn thành</>
                      )}
                    </button>
                  </div>
                </div>
              )}
              {selectedQuiz !== null && course.quizzes && course.quizzes[selectedQuiz] && (
                <div style={{ marginBottom: "2rem" }}>
                  <h2>Quiz {selectedQuiz + 1}: {course.quizzes[selectedQuiz].title}</h2>
                  <div style={{ color: "#92400e", marginBottom: "1rem" }}>
                    {course.quizzes[selectedQuiz].description}
                  </div>
                  {course.quizzes[selectedQuiz].questions && course.quizzes[selectedQuiz].questions.length > 0 ? (
                    <React.Fragment>
                      {course.quizzes[selectedQuiz].questions.map((q, qIdx) => {
                        const quizKey = course.quizzes[selectedQuiz]._id || selectedQuiz;
                        const selected = quizAnswers[quizKey]?.[qIdx];
                        return (
                          <div key={qIdx} style={{ marginBottom: "1.5rem" }}>
                            <div style={{ fontWeight: 600, marginBottom: "0.5rem", color: "#7a5a00" }}>
                              Câu {qIdx + 1}: {q.question}
                            </div>
                            {q.options && q.options.length > 0 && (
                              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                                {q.options.map((opt, optIdx) => {
                                  const isSelected = typeof selected === "number" && optIdx === selected;
                                  return (
                                    <li key={optIdx} style={{ marginBottom: "0.5rem" }}>
                                      <button
                                        type="button"
                                        onClick={() => selectAnswer(quizKey, qIdx, optIdx)}
                                        style={{
                                          width: "100%",
                                          textAlign: "left",
                                          background: isSelected ? "#dbeafe" : "#fff",
                                          border: isSelected ? "2px solid #3b82f6" : "2px solid #e8ecf1",
                                          borderRadius: 8,
                                          padding: "0.6rem 0.75rem",
                                          cursor: "pointer",
                                          color: "#1f2937",
                                        }}
                                      >
                                        <strong style={{ marginRight: 8 }}>{String.fromCharCode(65 + optIdx)}.</strong>
                                        {opt}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                      {/* Nút nộp bài */}
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: "1rem" }}
                        disabled={
                          !course.quizzes[selectedQuiz].questions.every((_, qIdx) => typeof quizAnswers[course.quizzes[selectedQuiz]._id || selectedQuiz]?.[qIdx] === "number")
                        }
                        onClick={() => {
                          // 1. Lấy thông tin quiz và tính điểm
                          const quiz = course.quizzes[selectedQuiz];
                          const quizKey = quiz._id || selectedQuiz;
                          const totalQuestions = quiz.questions.length;
                          const passingScore = quiz.passingScore || 70; // Mặc định 70%
                          let correct = 0;
                          quiz.questions.forEach((q, qIdx) => {
                            if (quizAnswers[quizKey]?.[qIdx] === q.correctAnswer) correct++;
                          });
                          const score = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;

                          // 2. Kiểm tra kết quả
                          if (score >= passingScore) {
                            // Nếu đạt
                            alert(`Chúc mừng! Bạn đã trả lời đúng ${correct}/${totalQuestions} câu (${score.toFixed(0)}%). Bạn đã hoàn thành bài kiểm tra này.`);
                            handleCompleteQuiz(quiz._id); // Gửi kết quả lên server
                            setSelectedQuiz(null); // Ẩn cửa sổ câu hỏi
                          } else {
                            // Nếu không đạt
                            alert(`Rất tiếc, bạn chỉ trả lời đúng ${correct}/${totalQuestions} câu (${score.toFixed(0)}%). Vui lòng thử lại để đạt được ít nhất ${passingScore}%.`);
                            // Xóa các câu trả lời đã chọn cho quiz này để người dùng làm lại
                            setQuizAnswers(prev => {
                              const newAnswers = { ...prev };
                              delete newAnswers[quizKey];
                              return newAnswers;
                            });
                          }
                        }}
                      >
                        Nộp bài
                      </button>
                    </React.Fragment>
                  ) : (
                    <div style={{ color: "#7a5a00" }}>Chưa có câu hỏi trong quiz này.</div>
                  )}
                </div>
              )}
              {/* Nếu chưa chọn gì, hiện mô tả khóa học */}
              {selectedLesson === null && selectedQuiz === null && (
                <div className="course-form" style={{ padding: "2rem", background: "white", borderRadius: "12px", marginBottom: "2rem" }}>
                  <h2 style={{ marginBottom: "1rem" }}>Nội dung khóa học</h2>
                  <p style={{ color: "var(--text)", lineHeight: "1.6" }}>{course.description}</p>
                </div>
              )}
            </div>
            {/* Sidebar phải: danh sách bài học và quiz */}
            <div>
              <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "2rem" }}>
                <h3 style={{ marginBottom: "1rem" }}><i className="fas fa-list"></i> Danh sách bài học</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {course.lessons && course.lessons.length > 0 ? course.lessons.map((lesson, idx) => (
                    <li key={lesson._id || idx} style={{ marginBottom: "0.5rem" }}>
                      <button
                        type="button"
                        style={{ width: "100%", textAlign: "left", background: completedLessons?.includes?.(lesson._id) ? "#d1fae5" : "#f8f9fb", border: "none", borderRadius: 8, padding: "0.7rem 1rem", cursor: "pointer", color: "#1e293b", fontWeight: 500 }}
                        onClick={() => setSelectedLesson(idx)}
                      >
                        <i className="fas fa-play-circle" style={{ color: "var(--primary)", marginRight: 8 }}></i>
                        Bài {idx + 1}: {lesson.title}
                        {completedLessons?.includes?.(lesson._id) && <span style={{ color: "#10b981", marginLeft: 8 }}><i className="fas fa-check-circle"></i></span>}
                      </button>
                    </li>
                  )) : <li style={{ color: "#64748b" }}>Chưa có bài học nào.</li>}
                </ul>
              </div>
              <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <h3 style={{ marginBottom: "1rem" }}><i className="fas fa-question-circle"></i> Danh sách bài kiểm tra</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {course.quizzes && course.quizzes.length > 0 ? course.quizzes.map((quiz, idx) => (
                    <li key={quiz._id || idx} style={{ marginBottom: "0.5rem" }}>
                      <button
                        type="button"
                        style={{ width: "100%", textAlign: "left", background: enrollment?.completedQuizzes?.includes?.(quiz._id) ? "#fef9c3" : "#f8f9fb", border: "none", borderRadius: 8, padding: "0.7rem 1rem", cursor: "pointer", color: "#92400e", fontWeight: 500 }}
                        onClick={() => {
                          setSelectedQuiz(idx);
                          // Nếu bài quiz này đã hoàn thành, xóa câu trả lời cũ để làm lại
                          if (enrollment?.completedQuizzes?.includes?.(quiz._id)) {
                            const quizKey = quiz._id || idx;
                            setQuizAnswers(prev => ({ ...prev, [quizKey]: {} }));
                          }
                        }}
                      >
                        <i className="fas fa-question-circle" style={{ color: "#f59e0b", marginRight: 8 }}></i>
                        Quiz {idx + 1}: {quiz.title}
                        {enrollment?.completedQuizzes?.includes?.(quiz._id) && <span style={{ color: "#22c55e", marginLeft: 8 }}><i className="fas fa-check"></i></span>}
                      </button>
                    </li>
                  )) : <li style={{ color: "#64748b" }}>Chưa có bài kiểm tra nào.</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

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
