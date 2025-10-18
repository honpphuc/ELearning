import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "./apiService";

// Helper function để convert YouTube URL sang embed URL
const getEmbedUrl = (url) => {
  if (!url) return null;
  
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtube.com') 
      ? url.split('v=')[1]?.split('&')[0]
      : url.split('youtu.be/')[1]?.split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
  }
  
  // Nếu đã là embed URL thì return luôn
  if (url.includes('embed')) return url;
  
  return null;
};

// Giao diện chi tiết khóa học - tiếng Việt
const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await getCourseById(id);
      setCourse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading" style={{ textAlign: 'center', padding: '5rem' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
        <p>Đang tải khóa học...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: 'var(--danger)', marginBottom: '1rem' }}></i>
        <h2>Không tìm thấy khóa học</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/courses')} className="btn btn-primary">
          <i className="fas fa-arrow-left"></i> Quay lại danh sách
        </button>
      </div>
    );
  }

  const {
    title = "Khóa học",
    description = "",
    category = "",
    rating = 0,
    students = 0,
    duration = "",
    level = "",
    instructor = "",
    price = 0,
    lectures = 0,
    exercises = 0,
    icon = "fas fa-book",
    videoUrl = "",
  } = course;

  const embedUrl = getEmbedUrl(videoUrl);
  
  // Default values for demo
  const instructorTitle = "Giảng viên chuyên nghiệp";
  const instructorBio = "Giảng viên giàu kinh nghiệm trong lĩnh vực giáo dục.";
  const certificate = true;
  const fullDescription = description || "Khóa học này cung cấp kiến thức chuyên sâu giúp bạn phát triển kỹ năng.";
  const learningOutcomes = [
    "Nắm vững kiến thức cơ bản và nâng cao",
    "Áp dụng thực tế vào công việc",
    "Phát triển tư duy logic",
  ];
  const requirements = [
    "Biết sử dụng máy tính cơ bản",
    "Có tinh thần học hỏi",
  ];
  const curriculum = [];
  const reviews = [];
  const language = "Tiếng Việt";
  const lastUpdated = "10/2025";

  return (
    <div className="course-detail-page">
      {/* Hero Section */}
      <section className="course-detail-hero compact">
        <div className="container">
          <div className="course-detail-header">
            <div className="course-detail-info">
              <div className="course-breadcrumb">
                <a href="/courses">Khóa học</a>
                <i className="fas fa-chevron-right"></i>
                <span>{category}</span>
              </div>
              <h2>{title}</h2>
              <p className="course-subtitle">{description}</p>
              <div className="course-stats">
                <div className="stat-item">
                  <i className="fas fa-star"></i>
                  <span className="rating-number">{rating}</span>
                  <span className="rating-count">({students} đánh giá)</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-users"></i>
                  <span>{students.toLocaleString("vi-VN")} học viên</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-clock"></i>
                  <span>{duration}</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-signal"></i>
                  <span>{level}</span>
                </div>
              </div>
              <div className="instructor-info">
                <div className="instructor-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="instructor-details">
                  <span className="instructor-label">Giảng viên</span>
                  <span className="instructor-name">{instructor}</span>
                </div>
              </div>
            </div>
            <div className="course-detail-card">
              {/* Video Preview */}
              {embedUrl ? (
                <div className="course-video-preview" style={{ 
                  position: 'relative', 
                  paddingBottom: '56.25%', 
                  height: 0, 
                  overflow: 'hidden',
                  borderRadius: '12px 12px 0 0'
                }}>
                  <iframe
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    src={embedUrl}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="course-card-preview">
                  <div className="course-preview-icon">
                    <i className={icon}></i>
                  </div>
                </div>
              )}
              <div className="course-card-body">
                <div className="course-price-box">
                  <span className="course-price-main">
                    {price.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="course-price-old">299.000đ</span>
                  <span className="course-discount">-33%</span>
                </div>
                <a
                  href={`/payment/${course._id}`}
                  className="btn btn-enroll"
                >
                  <i className="fas fa-shopping-cart"></i> Đăng ký ngay
                </a>
                <div className="course-includes">
                  <h4>Khóa học bao gồm:</h4>
                  <ul>
                    <li>
                      <i className="fas fa-play-circle"></i> {lectures} bài
                      giảng
                    </li>
                    <li>
                      <i className="fas fa-tasks"></i> {exercises} bài tập
                    </li>
                    <li>
                      <i className="fas fa-infinity"></i> Truy cập trọn đời
                    </li>
                    <li>
                      <i className="fas fa-mobile-alt"></i> Học trên mọi thiết
                      bị
                    </li>
                    {certificate && (
                      <li>
                        <i className="fas fa-certificate"></i> Chứng chỉ hoàn
                        thành
                      </li>
                    )}
                    <li>
                      <i className="fas fa-headset"></i> Hỗ trợ trực tuyến
                    </li>
                  </ul>
                </div>
                <div className="course-share">
                  <button className="btn-share">
                    <i className="fas fa-share-alt"></i> Chia sẻ
                  </button>
                  <button className="btn-wishlist">
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="course-detail-content">
        <div className="container">
          <div
            className="content-wrapper"
            style={{ display: "flex", gap: "32px" }}
          >
            <div className="content-main" style={{ flex: 1 }}>
              <div className="course-tabs">
                <button
                  className={`tab-btn ${
                    activeTab === "overview" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Tổng quan
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "curriculum" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("curriculum")}
                >
                  Nội dung khóa học
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "instructor" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("instructor")}
                >
                  Giảng viên
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "reviews" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Đánh giá
                </button>
              </div>
              <div className="tab-content">
                {activeTab === "overview" && (
                  <div className="overview-content">
                    <div className="content-section">
                      <h2>Mô tả khóa học</h2>
                      <p>{fullDescription}</p>
                    </div>
                    <div className="content-section">
                      <h2>Bạn sẽ học được gì?</h2>
                      <div className="learning-outcomes">
                        {learningOutcomes.map((outcome, idx) => (
                          <div key={idx} className="outcome-item">
                            <i className="fas fa-check-circle"></i>
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="content-section">
                      <h2>Yêu cầu</h2>
                      <ul className="requirements-list">
                        {requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {activeTab === "curriculum" && (
                  <div className="curriculum-content">
                    <div className="curriculum-header">
                      <h2>Nội dung khóa học</h2>
                      <p>
                        {curriculum.length} phần • {lectures} bài giảng •{" "}
                        {duration} tổng thời lượng
                      </p>
                    </div>
                    <div className="curriculum-list">
                      {curriculum.map((section, idx) => (
                        <div key={idx} className="curriculum-section">
                          <div className="section-header">
                            <div className="section-title">
                              <i className="fas fa-folder"></i>{" "}
                              <span>{section.section}</span>
                            </div>
                            <div className="section-info">
                              {section.lectures} bài giảng • {section.duration}
                            </div>
                          </div>
                          <div className="section-lessons">
                            {section.lessons.map((lesson, lessonIdx) => (
                              <div key={lessonIdx} className="lesson-item">
                                <div className="lesson-title">
                                  <i className="fas fa-play-circle"></i>{" "}
                                  <span>{lesson.title}</span>
                                  {lesson.free && (
                                    <span className="lesson-free">Xem thử</span>
                                  )}
                                </div>
                                <div className="lesson-duration">
                                  <i className="far fa-clock"></i>{" "}
                                  {lesson.duration}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "instructor" && (
                  <div className="instructor-content">
                    <div className="instructor-profile">
                      <div className="instructor-avatar-large">
                        <i className="fas fa-user-circle"></i>
                      </div>
                      <div className="instructor-bio">
                        <h2>{instructor}</h2>
                        <p className="instructor-title-text">
                          {instructorTitle}
                        </p>
                        <div className="instructor-stats">
                          <div className="stat">
                            <i className="fas fa-star"></i> {rating} Đánh giá
                          </div>
                          <div className="stat">
                            <i className="fas fa-users"></i>{" "}
                            {students.toLocaleString("vi-VN")} Học viên
                          </div>
                          <div className="stat">
                            <i className="fas fa-play-circle"></i> {lectures}{" "}
                            Khóa học
                          </div>
                        </div>
                        <p className="instructor-description">
                          {instructorBio}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "reviews" && (
                  <div className="reviews-content">
                    <div className="reviews-summary">
                      <div className="rating-overview">
                        <div className="rating-number-large">{rating}</div>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`fas fa-star ${
                                star <= rating ? "filled" : ""
                              }`}
                            ></i>
                          ))}
                        </div>
                        <div className="rating-text">Đánh giá khóa học</div>
                      </div>
                    </div>
                    <div className="reviews-list">
                      {reviews.map((review) => (
                        <div key={review.id} className="review-item">
                          <div className="review-header">
                            <div className="reviewer-avatar">
                              <i className="fas fa-user-circle"></i>
                            </div>
                            <div className="reviewer-info">
                              <h4>{review.name}</h4>
                              <div className="review-meta">
                                <div className="review-rating">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                      key={star}
                                      className={`fas fa-star ${
                                        star <= review.rating ? "filled" : ""
                                      }`}
                                    ></i>
                                  ))}
                                </div>
                                <span className="review-date">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="content-sidebar" style={{ width: "260px" }}>
              <div className="sidebar-card">
                <h3>Thông tin khóa học</h3>
                <ul className="course-info-list">
                  <li>
                    <i className="fas fa-language"></i>{" "}
                    <div>
                      <strong>Ngôn ngữ</strong> <span>{language}</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-calendar-alt"></i>{" "}
                    <div>
                      <strong>Cập nhật</strong> <span>{lastUpdated}</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-signal"></i>{" "}
                    <div>
                      <strong>Trình độ</strong> <span>{level}</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-play-circle"></i>{" "}
                    <div>
                      <strong>Bài giảng</strong> <span>{lectures} bài</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-tasks"></i>{" "}
                    <div>
                      <strong>Bài tập</strong> <span>{exercises} bài</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-certificate"></i>{" "}
                    <div>
                      <strong>Chứng chỉ</strong>{" "}
                      <span>{certificate ? "Có" : "Không"}</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="sidebar-card">
                <h3>Khóa học liên quan</h3>
                <div className="related-courses">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="related-course-item">
                      <div className="related-course-icon">
                        <i className="fas fa-code"></i>
                      </div>
                      <div className="related-course-info">
                        <h4>Khóa học {i}</h4>
                        <p className="related-course-price">199.000đ</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
