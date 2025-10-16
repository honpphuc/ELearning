import React from "react";

const MyCourses = ({ myCourses = [] }) => (
  <section className="my-courses">
    <div className="container">
      <h2 className="section-title">Khóa học của tôi</h2>
      <div className="courses-grid">
        {myCourses.length === 0 ? (
          <p>Bạn chưa đăng ký khóa học nào.</p>
        ) : (
          myCourses.map((course, idx) => (
            <div key={course.id || idx} className="course-card">
              <div className="course-image">
                <i className={course.icon}></i>
              </div>
              <div className="course-content">
                <span className="course-category">{course.category}</span>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span>
                    <i className="fas fa-clock"></i> {course.duration}
                  </span>
                  <span>
                    <i className="fas fa-star"></i> {course.rating}/5
                  </span>
                </div>
                <div className="course-status">{course.status}</div>
                <a href={`/courses/${course.id}`} className="btn btn-detail">
                  Xem chi tiết
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </section>
);

export default MyCourses;
