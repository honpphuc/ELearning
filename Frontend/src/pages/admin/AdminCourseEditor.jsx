import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdminCourseById, updateCourseContent } from "../apiService";

const AdminCourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: "", videoUrl: "", duration: "", description: "" });
  const [expandedLesson, setExpandedLesson] = useState(null);
  
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: "", description: "", questions: [] });
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [newQuestion, setNewQuestion] = useState({ question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" });

  useEffect(() => {
    if (id) fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await getAdminCourseById(id);
      setCourse(data);
      setLessons(data.lessons || []);
      setQuizzes(data.quizzes || []);
    } catch (err) {
      alert(err.message);
      navigate("/admin/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = () => {
    if (!newLesson.title || !newLesson.videoUrl) return alert("Tiêu đề và URL video là bắt buộc");
    setLessons([...lessons, { ...newLesson, order: lessons.length }]);
    setNewLesson({ title: "", videoUrl: "", duration: "", description: "" });
  };

  const handleRemoveLesson = (index) => setLessons(lessons.filter((_, i) => i !== index));

  const handleAddQuestion = () => {
    if (!newQuestion.question || newQuestion.options.some(o => !o)) {
      return alert("Vui lòng điền đầy đủ câu hỏi và tất cả các đáp án");
    }
    setNewQuiz({ ...newQuiz, questions: [...newQuiz.questions, { ...newQuestion }] });
    setNewQuestion({ question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" });
  };

  const handleRemoveQuestion = (qIndex) => {
    setNewQuiz({ ...newQuiz, questions: newQuiz.questions.filter((_, i) => i !== qIndex) });
  };

  const handleAddQuiz = () => {
    if (!newQuiz.title || newQuiz.questions.length === 0) {
      return alert("Tiêu đề và ít nhất 1 câu hỏi là bắt buộc");
    }
    setQuizzes([...quizzes, { ...newQuiz, order: quizzes.length, passingScore: 70 }]);
    setNewQuiz({ title: "", description: "", questions: [] });
  };

  const handleRemoveQuiz = (index) => setQuizzes(quizzes.filter((_, i) => i !== index));

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateCourseContent(id, { lessons, quizzes });
      alert("✅ Lưu thành công!");
      fetchCourse();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: "2.5rem", color: "var(--primary)" }}></i>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!course) return null;

  const inputStyle = {
    width: "100%",
    padding: "0.6rem 0.8rem",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "0.9rem",
    marginBottom: "0.6rem"
  };

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem"
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "1rem" }}>
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ 
          ...cardStyle, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "1rem"
        }}>
          <div>
            <button onClick={() => navigate("/admin/courses")} className="btn" style={{ marginRight: "0.75rem" }}>
              <i className="fas fa-arrow-left"></i> Quay lại
            </button>
            <h2 style={{ display: "inline", fontSize: "1.3rem", color: "var(--primary-darker)" }}>
              {course.title}
            </h2>
          </div>
          <button onClick={handleSave} className="btn btn-success" disabled={saving}>
            {saving ? <><i className="fas fa-spinner fa-spin"></i> Đang lưu...</> : <><i className="fas fa-save"></i> Lưu tất cả</>}
          </button>
        </div>

        {/* Layout 2 cột */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          
          {/* Cột trái - Forms */}
          <div>
            
            {/* Form Bài học */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "var(--primary-darker)", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem" }}>
                <i className="fas fa-video" style={{ color: "var(--primary)", marginRight: "0.5rem" }}></i>
                Thêm bài học
              </h3>
              <input {...inputStyle} placeholder="Tiêu đề bài học *" value={newLesson.title} onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })} style={inputStyle} />
              <input placeholder="Thời lượng (VD: 15 phút)" value={newLesson.duration} onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })} style={inputStyle} />
              <input placeholder="URL Video *" value={newLesson.videoUrl} onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })} style={inputStyle} />
              <textarea placeholder="Mô tả" rows="2" value={newLesson.description} onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
              <button onClick={handleAddLesson} className="btn btn-primary" style={{ width: "100%" }}>
                <i className="fas fa-plus"></i> Thêm
              </button>
            </div>

            {/* Form Bài kiểm tra */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem", color: "#92400e", borderBottom: "1px solid #fde68a", paddingBottom: "0.5rem" }}>
                <i className="fas fa-question-circle" style={{ color: "#f59e0b", marginRight: "0.5rem" }}></i>
                Tạo bài kiểm tra
              </h3>
              <input placeholder="Tiêu đề bài kiểm tra *" value={newQuiz.title} onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })} style={inputStyle} />
              <textarea placeholder="Mô tả" rows="2" value={newQuiz.description} onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
              
              {newQuiz.questions.length > 0 && (
                <div style={{ background: "#f0fdf4", padding: "0.75rem", borderRadius: "6px", marginBottom: "0.6rem" }}>
                  <strong style={{ fontSize: "0.85rem", color: "#166534" }}>
                    <i className="fas fa-check-circle"></i> {newQuiz.questions.length} câu hỏi
                  </strong>
                  {newQuiz.questions.map((q, i) => (
                    <div key={i} style={{ background: "#fff", padding: "0.5rem", borderRadius: "4px", marginTop: "0.4rem", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                      <span><strong>Câu {i + 1}:</strong> {q.question}</span>
                      <button onClick={() => handleRemoveQuestion(i)} className="btn btn-sm btn-danger" style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}>Xóa</button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ background: "#e0f2fe", padding: "0.75rem", borderRadius: "6px", border: "1px dashed #0ea5e9", marginBottom: "0.6rem" }}>
                <h5 style={{ fontSize: "0.9rem", marginBottom: "0.5rem", color: "#0369a1" }}>Thêm câu hỏi</h5>
                <input placeholder="Câu hỏi *" value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} style={{ ...inputStyle, marginBottom: "0.4rem" }} />
                {newQuestion.options.map((opt, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem", alignItems: "center" }}>
                    <input type="radio" checked={newQuestion.correctAnswer === i} onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: i })} />
                    <input placeholder={`Đáp án ${i + 1} *`} value={opt} onChange={(e) => {
                      const newOpts = [...newQuestion.options];
                      newOpts[i] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOpts });
                    }} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                  </div>
                ))}
                <input placeholder="Giải thích (tùy chọn)" value={newQuestion.explanation} onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })} style={inputStyle} />
                <button onClick={handleAddQuestion} className="btn btn-success" style={{ width: "100%", padding: "0.5rem", fontSize: "0.85rem" }}>
                  <i className="fas fa-plus"></i> Thêm câu hỏi
                </button>
              </div>

              <button onClick={handleAddQuiz} className="btn btn-primary" style={{ width: "100%" }} disabled={newQuiz.questions.length === 0}>
                <i className="fas fa-check"></i> Lưu bài kiểm tra ({newQuiz.questions.length} câu)
              </button>
            </div>
          </div>

          {/* Cột phải - Danh sách */}
          <div>
            
            {/* Danh sách bài học */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><i className="fas fa-list"></i> Bài học</span>
                <span style={{ fontSize: "0.85rem", background: "var(--primary)", color: "white", padding: "0.2rem 0.6rem", borderRadius: "12px" }}>
                  {lessons.length}
                </span>
              </h3>

              {lessons.length === 0 ? (
                <p style={{ textAlign: "center", color: "#94a3b8", padding: "1.5rem" }}>
                  <i className="fas fa-inbox" style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}></i>
                  Chưa có bài học
                </p>
              ) : (
                <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                  {lessons.map((lesson, i) => (
                    <div key={i}>
                      <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "6px", marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0" }}>
                        <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                          <i className="fas fa-play-circle" style={{ color: "var(--primary)", marginRight: "0.4rem" }}></i>
                          Bài {i + 1}: {lesson.title}
                        </span>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button onClick={() => setExpandedLesson(expandedLesson === i ? null : i)} className="btn btn-sm" style={{ padding: "0.3rem 0.6rem", background: expandedLesson === i ? "var(--primary)" : "#f1f5f9", color: expandedLesson === i ? "white" : "var(--primary)" }}>
                            <i className="fas fa-info-circle"></i>
                          </button>
                          <button onClick={() => handleRemoveLesson(i)} className="btn btn-sm btn-danger" style={{ padding: "0.3rem 0.6rem" }}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      {expandedLesson === i && (
                        <div style={{ background: "#e0f2fe", padding: "1rem", borderRadius: "6px", marginBottom: "0.75rem", fontSize: "0.85rem", border: "1px solid #0ea5e9" }}>
                          <button onClick={() => setExpandedLesson(null)} style={{ float: "right", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>×</button>
                          <p><strong>Thời lượng:</strong> {lesson.duration || "Chưa có"}</p>
                          <p><strong>URL:</strong> <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0ea5e9", wordBreak: "break-all" }}>{lesson.videoUrl}</a></p>
                          {lesson.description && <p><strong>Mô tả:</strong> {lesson.description}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Danh sách bài kiểm tra */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><i className="fas fa-clipboard-list"></i> Bài kiểm tra</span>
                <span style={{ fontSize: "0.85rem", background: "#f59e0b", color: "white", padding: "0.2rem 0.6rem", borderRadius: "12px" }}>
                  {quizzes.length}
                </span>
              </h3>

              {quizzes.length === 0 ? (
                <p style={{ textAlign: "center", color: "#94a3b8", padding: "1.5rem" }}>
                  <i className="fas fa-clipboard" style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}></i>
                  Chưa có bài kiểm tra
                </p>
              ) : (
                <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                  {quizzes.map((quiz, i) => (
                    <div key={i}>
                      <div style={{ background: "#fefce8", padding: "0.75rem", borderRadius: "6px", marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #fde68a" }}>
                        <div>
                          <span style={{ fontWeight: "600", fontSize: "0.9rem", color: "#92400e" }}>
                            <i className="fas fa-question-circle" style={{ color: "#f59e0b", marginRight: "0.4rem" }}></i>
                            Bài {i + 1}: {quiz.title}
                          </span>
                          <span style={{ fontSize: "0.75rem", background: "#fef3c7", color: "#92400e", padding: "0.15rem 0.5rem", borderRadius: "10px", marginLeft: "0.5rem" }}>
                            {quiz.questions.length} câu
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button onClick={() => setExpandedQuiz(expandedQuiz === i ? null : i)} className="btn btn-sm" style={{ padding: "0.3rem 0.6rem", background: expandedQuiz === i ? "#f59e0b" : "#fef3c7", color: expandedQuiz === i ? "white" : "#f59e0b" }}>
                            <i className="fas fa-info-circle"></i>
                          </button>
                          <button onClick={() => handleRemoveQuiz(i)} className="btn btn-sm btn-danger" style={{ padding: "0.3rem 0.6rem" }}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      {expandedQuiz === i && (
                        <div style={{ background: "#fef3c7", padding: "1rem", borderRadius: "6px", marginBottom: "0.75rem", fontSize: "0.85rem", border: "1px solid #f59e0b" }}>
                          <button onClick={() => setExpandedQuiz(null)} style={{ float: "right", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>×</button>
                          <p><strong>Số câu:</strong> {quiz.questions.length}</p>
                          <p><strong>Điểm đạt:</strong> {quiz.passingScore}%</p>
                          {quiz.description && <p><strong>Mô tả:</strong> {quiz.description}</p>}
                          <details style={{ marginTop: "0.5rem" }}>
                            <summary style={{ cursor: "pointer", fontWeight: "600", color: "#92400e" }}>Xem câu hỏi</summary>
                            <div style={{ marginTop: "0.5rem" }}>
                              {quiz.questions.map((q, qi) => (
                                <div key={qi} style={{ background: "#fff", padding: "0.5rem", borderRadius: "4px", marginBottom: "0.4rem" }}>
                                  <strong>Câu {qi + 1}:</strong> {q.question}<br />
                                  <span style={{ color: "#16a34a", fontSize: "0.8rem" }}>✓ {q.options[q.correctAnswer]}</span>
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseEditor;
