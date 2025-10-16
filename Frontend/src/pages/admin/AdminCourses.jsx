import React, { useState } from "react";

const AdminCourses = ({
  courses = [],
  csrfToken = "",
  errorMessage = "",
  successMessage = "",
}) => {
  const [formData, setFormData] = useState({
    icon: "",
    image: "",
    category: "",
    title: "",
    description: "",
    duration: "",
    students: "",
    rating: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="page-section">
      <div className="container">
        <h1 className="admin-title" style={{ color: "black" }}>
          Quản lý khóa học
        </h1>

        <div className="admin" style={{ marginBottom: "1.5rem" }}>
          <h3>Thêm khóa học mới</h3>
          {errorMessage && (
            <div className="alert alert-error">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          <form method="POST" action="/admin/courses">
            <input type="hidden" name="_csrf" value={csrfToken} />
            <div className="form-group">
              <label>Icon (class)</label>
              <input
                type="text"
                name="icon"
                placeholder="fab fa-js-square"
                value={formData.icon}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Ảnh khóa học (URL)</label>
              <input
                type="text"
                name="image"
                placeholder="https://.../thumb.jpg"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Danh mục</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Tiêu đề</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="row">
              <div className="form-group">
                <label>Thời lượng</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Học viên</label>
                <input
                  type="text"
                  name="students"
                  value={formData.students}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group">
                <label>Đánh giá</label>
                <input
                  type="text"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Giá (VND)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button className="btn btn-primary" type="submit">
              Thêm khóa học
            </button>
          </form>
        </div>

        <div className="admin-courses-grid">
          {courses && courses.length > 0 ? (
            courses.map((c) => (
              <div key={c.id} className="admin-course-card">
                <div className="course-thumb">
                  {c.icon && c.icon.startsWith("http") ? (
                    <img src={c.icon} alt={c.title} />
                  ) : c.icon ? (
                    <div className="course-icon">
                      <i className={c.icon}></i>
                    </div>
                  ) : (
                    <div className="course-icon">
                      <i className="fas fa-book"></i>
                    </div>
                  )}
                </div>
                <div className="course-info">
                  <h4>{c.title}</h4>
                  <div className="meta">
                    <span className="category">{c.category || "-"}</span> ·{" "}
                    <span className="students">
                      {c.students || "-"} học viên
                    </span>
                  </div>
                  <div className="created">
                    {new Date(c.created_at).toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="admin-empty">Chưa có khóa học.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminCourses;
