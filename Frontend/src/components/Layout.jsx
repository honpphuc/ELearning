import React, { useState } from "react";

const Layout = ({ children, user = null }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <>
      <header className="header">
        <nav className="nav">
          <div className="logo">
            <i className="fas fa-graduation-cap"></i>
            <span>EduLearn</span>
          </div>
          <ul className="nav-links">
            <li>
              <a href="/">Trang chủ</a>
            </li>
            <li>
              <a href="/courses">Khóa học</a>
            </li>
            <li>
              <a href="/features">Tính năng</a>
            </li>
            <li>
              <a href="/about">Giới thiệu</a>
            </li>
            <li>
              <a href="/contact">Liên hệ</a>
            </li>
          </ul>
          <div className="auth-buttons">
            {user ? (
              <div className={`user-menu ${userMenuOpen ? "open" : ""}`}>
                <button
                  className="user-btn"
                  onClick={toggleUserMenu}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                >
                  {user.name} <i className="fas fa-chevron-down"></i>
                </button>
                <div className="user-dropdown">
                  <a href="/profile">Hồ sơ</a>
                  <a href="/my-courses">Khóa học của tôi</a>
                  <a href="/settings">Cài đặt</a>
                  {user.role === "admin" && (
                    <a href="/admin/dashboard">Quản trị</a>
                  )}
                  <form method="POST" action="/logout">
                    <button type="submit" className="logout-btn">
                      Đăng xuất
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <>
                <a href="/login" className="btn btn-outline">
                  Đăng nhập
                </a>
                <a href="/register" className="btn btn-primary">
                  Đăng ký
                </a>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="main-wrapper">{children}</main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>EduLearn</h3>
            <p>Nền tảng học trực tuyến hàng đầu Việt Nam</p>
            <div className="social-links">
              <a href="#">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Liên kết</h3>
            <a href="/about">Giới thiệu</a>
            <a href="/courses">Khóa học</a>
            <a href="/contact">Liên hệ</a>
          </div>
          <div className="footer-section">
            <h3>Hỗ trợ</h3>
            <a href="#">Trung tâm trợ giúp</a>
            <a href="#">Điều khoản dịch vụ</a>
            <a href="#">Chính sách bảo mật</a>
          </div>
          <div className="footer-section">
            <h3>Liên hệ</h3>
            <p>Email: support@edulearn.vn</p>
            <p>Hotline: 1900-xxxx</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 EduLearn. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;
