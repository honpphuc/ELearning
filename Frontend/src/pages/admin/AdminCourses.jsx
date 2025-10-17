import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form for creating a course
  const [form, setForm] = useState({ 
    title: "", 
    category: "", 
    description: "", 
    price: "",
    duration: "",
    lectures: "",
    exercises: "",
    instructor: "",
    level: "",
    videoUrl: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không lấy được danh sách khóa học");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title) return alert("Tiêu đề bắt buộc");
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Tạo khóa học thất bại");
      }
      alert("✅ Tạo khóa học thành công!");
      setForm({ 
        title: "", 
        category: "", 
        description: "", 
        price: "", 
        duration: "",
        lectures: "",
        exercises: "",
        instructor: "",
        level: "",
        videoUrl: ""
      });
      fetchCourses();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa khóa học "${title}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/courses/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Xóa thất bại");
      fetchCourses();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return (
    <section className="page-section">
      <div className="container">
        <div className="loading">Đang tải...</div>
      </div>
    </section>
  );
  
  if (error) return (
    <section className="page-section">
      <div className="container">
        <div className="alert alert-error">Lỗi: {error}</div>
      </div>
    </section>
  );

  // Tính thống kê
  const totalCourses = courses.length;
  const totalRevenue = courses.reduce((sum, c) => sum + (c.price || 0), 0);
  const avgPrice = totalCourses > 0 ? Math.round(totalRevenue / totalCourses) : 0;

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-header">
          <h1 className="admin-title">
            <i className="fas fa-book"></i> Quản lý khóa học
          </h1>
        </div>

        {/* Thống kê khóa học */}
        <div className="admin-grid">
          <div className="admin-card">
            <h3>Tổng khóa học</h3>
            <span className="stat-number">{totalCourses}</span>
            <div className="stat-label">
              <i className="fas fa-book-open"></i>
              Khóa học hiện có
            </div>
          </div>

          <div className="admin-card">
            <h3>Tổng doanh thu tiềm năng</h3>
            <span className="stat-number">{totalRevenue.toLocaleString('vi-VN')}</span>
            <div className="stat-label">
              <i className="fas fa-dollar-sign"></i>
              VND
            </div>
          </div>

          <div className="admin-card">
            <h3>Giá trung bình</h3>
            <span className="stat-number">{avgPrice.toLocaleString('vi-VN')}</span>
            <div className="stat-label">
              <i className="fas fa-chart-line"></i>
              VND / khóa học
            </div>
          </div>
        </div>

        {/* Form tạo khóa học */}
        <form onSubmit={handleCreate} className="course-form">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-darker)' }}>
            <i className="fas fa-plus-circle"></i> Thêm khóa học mới
          </h3>
          <div className="form-row">
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="Tiêu đề khóa học *" 
              required
            />
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange}
              style={{ 
                padding: '0.9rem 1.2rem',
                border: '2px solid #e8ecf1',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
              required
            >
              <option value="">Chọn danh mục *</option>
              <option value="Công nghệ thông tin">Công nghệ thông tin</option>
              <option value="Ngôn Ngữ">Ngôn Ngữ</option>
              <option value="Nhiếp Ảnh">Nhiếp Ảnh</option>
            </select>
          </div>
          <div className="form-row">
            <input 
              name="price" 
              value={form.price} 
              onChange={handleChange} 
              placeholder="Giá (VND)" 
              type="number"
              min="0"
            />
            <input 
              name="duration" 
              value={form.duration || ""} 
              onChange={handleChange} 
              placeholder="Thời lượng (VD: 10 giờ)" 
            />
          </div>
          <div className="form-row">
            <input 
              name="instructor" 
              value={form.instructor || ""} 
              onChange={handleChange} 
              placeholder="Tên giảng viên (VD: Nguyễn Văn A)" 
            />
          </div>
          <div className="form-row">
            <input 
              name="lectures" 
              value={form.lectures || ""} 
              onChange={handleChange} 
              placeholder="Số bài giảng (VD: 45)" 
              type="number"
              min="0"
            />
            <input 
              name="exercises" 
              value={form.exercises || ""} 
              onChange={handleChange} 
              placeholder="Số bài tập (VD: 12)" 
              type="number"
              min="0"
            />
          </div>
          <div className="form-row">
            <select 
              name="level" 
              value={form.level || ""} 
              onChange={handleChange}
              style={{ 
                padding: '0.9rem 1.2rem',
                border: '2px solid #e8ecf1',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            >
              <option value="">Chọn trình độ</option>
              <option value="Beginner">Beginner (Cơ bản)</option>
              <option value="Intermediate">Intermediate (Trung cấp)</option>
              <option value="Advanced">Advanced (Nâng cao)</option>
            </select>
          </div>
          <div className="form-row">
            <input 
              name="videoUrl" 
              value={form.videoUrl || ""} 
              onChange={handleChange} 
              placeholder="URL Video (YouTube, Vimeo, etc. - VD: https://www.youtube.com/watch?v=xxxxx)" 
              type="url"
            />
          </div>
          <div className="form-row">
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Mô tả khóa học"
              rows="4"
            />
          </div>
          <div>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Đang lưu...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i> Thêm khóa học
                </>
              )}
            </button>
          </div>
        </form>

        {/* Bảng danh sách khóa học */}
        <div className="admin-table-wrap">
          <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-darker)" }}>
            <i className="fas fa-list"></i> Danh sách khóa học
          </h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Giảng viên</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Rating</th>
                <th>Bài giảng</th>
                <th>Bài tập</th>
                <th>Thời lượng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                    <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                    Chưa có khóa học nào
                  </td>
                </tr>
              )}
              {courses.map(c => (
                <tr key={c._id}>
                  <td><strong>{c.title}</strong></td>
                  <td>{c.instructor || '-'}</td>
                  <td>
                    <span className="badge" style={{ background: 'var(--badge-bg)', color: 'var(--primary-darker)' }}>
                      {c.category || '-'}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--accent)' }}>
                      {c.price ? Number(c.price).toLocaleString('vi-VN') + 'đ' : 'Miễn phí'}
                    </strong>
                  </td>
                  <td>
                    <span style={{ color: '#ffa500', fontWeight: 'bold' }}>
                      <i className="fas fa-star"></i> {c.rating || 0}
                    </span>
                  </td>
                  <td>
                    <i className="fas fa-video" style={{ color: 'var(--primary)' }}></i> {c.lectures || 0}
                  </td>
                  <td>
                    <i className="fas fa-file-alt" style={{ color: 'var(--accent)' }}></i> {c.exercises || 0}
                  </td>
                  <td>{c.duration || '-'}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary" 
                      onClick={() => navigate(`/admin/courses/${c._id}/edit`)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      <i className="fas fa-edit"></i> Sửa
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDelete(c._id, c.title)}
                    >
                      <i className="fas fa-trash"></i> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminCourses;
