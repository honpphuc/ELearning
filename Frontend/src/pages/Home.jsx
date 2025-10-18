import React, { useState, useEffect } from "react";
import { getPopularCourses } from "./apiService";

const Home = () => {
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularCourses();
    
    // Smooth scrolling for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    const clickHandler = (e) => {
      e.preventDefault();
      const target = document.querySelector(
        e.currentTarget.getAttribute("href")
      );
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    anchors.forEach((a) => a.addEventListener("click", clickHandler));

    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("fade-in-up");
      });
    }, observerOptions);
    document
      .querySelectorAll(
        ".feature-card, .course-card, .stat-item, .section-title"
      )
      .forEach((el) => observer.observe(el));

    return () => {
      anchors.forEach((a) => a.removeEventListener("click", clickHandler));
      observer.disconnect();
    };
  }, []);

  const fetchPopularCourses = async () => {
    try {
      setLoading(true);
      const data = await getPopularCourses();
      setPopularCourses(data);
    } catch (err) {
      console.error("Lỗi tải khóa học phổ biến:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section id="home" className="hero">
        <div className="hero-content fade-in-up">
          <h1>Học trực tuyến thông minh</h1>
          <p>
            Khám phá hàng nghìn khóa học chất lượng cao từ các chuyên gia hàng
            đầu. Học mọi lúc, mọi nơi với công nghệ hiện đại.
          </p>
          <div className="hero-buttons">
            <a href="/courses" className="btn btn-primary btn-large">
              <i className="fas fa-play-circle"></i>
              Bắt đầu học ngay
            </a>
            <a href="/features" className="btn btn-outline btn-large">
              <i className="fas fa-info-circle"></i>
              Tìm hiểu thêm
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <div className="section-title fade-in-up">
            <h2>Tại sao chọn EduLearn?</h2>
            <p>
              Chúng tôi cung cấp trải nghiệm học tập tốt nhất với công nghệ tiên
              tiến và phương pháp giảng dạy hiệu quả
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card fade-in-up">
              <div className="feature-icon">
                <i className="fas fa-video"></i>
              </div>
              <h3>Video HD chất lượng cao</h3>
              <p>
                Tất cả khóa học được quay với chất lượng HD, âm thanh rõ ràng và
                hình ảnh sắc nét để đảm bảo trải nghiệm học tập tốt nhất.
              </p>
            </div>
            <div className="feature-card fade-in-up">
              <div className="feature-icon">
                <i className="fas fa-certificate"></i>
              </div>
              <h3>Chứng chỉ được công nhận</h3>
              <p>
                Nhận chứng chỉ hoàn thành khóa học được công nhận bởi các doanh
                nghiệp và tổ chức giáo dục uy tín.
              </p>
            </div>
            <div className="feature-card fade-in-up">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Cộng đồng học tập</h3>
              <p>
                Tham gia cộng đồng học viên sôi động, thảo luận và chia sẻ kinh
                nghiệm với những người cùng chí hướng.
              </p>
            </div>
            <div className="feature-card fade-in-up">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Học mọi lúc mọi nơi</h3>
              <p>
                Truy cập khóa học trên mọi thiết bị - máy tính, tablet, điện
                thoại. Học offline với tính năng tải xuống.
              </p>
            </div>
            <div className="feature-card fade-in-up">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>Hỗ trợ 24/7</h3>
              <p>
                Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giải đáp mọi thắc mắc của
                bạn bất cứ lúc nào trong ngày.
              </p>
            </div>
            <div className="feature-card fade-in-up">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Theo dõi tiến độ</h3>
              <p>
                Hệ thống theo dõi tiến độ học tập chi tiết giúp bạn nắm bắt được
                quá trình học và đạt mục tiêu hiệu quả.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="courses">
        <div className="container">
          <div className="section-title fade-in-up">
            <h2>Khóa học phổ biến</h2>
            <p>
              Khám phá các khóa học được yêu thích nhất từ các lĩnh vực công
              nghệ, kinh doanh và sáng tạo
            </p>
          </div>
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
              <p>Đang tải khóa học...</p>
            </div>
          )}
          
          {!loading && popularCourses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--muted)' }}>Chưa có khóa học nào</p>
            </div>
          )}
          
          {!loading && popularCourses.length > 0 && (
            <div className="courses-grid">
              {popularCourses.map((course) => (
                <div key={course._id} className="course-card fade-in-up">
                  <div className="course-image">
                    <i className={course.icon || "fas fa-book"}></i>
                  </div>
                  <div className="course-content">
                    <span className="course-category">{course.category}</span>
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">{course.description}</p>
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
                    <div className="course-actions">
                      <a
                        href={`/payment/${course._id}`}
                        className="btn btn-register"
                      >
                        Đăng ký ngay
                      </a>
                      <a href={`/course/${course._id}`} className="btn btn-info">
                        <i className="fas fa-info-circle"></i> Chi tiết
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
