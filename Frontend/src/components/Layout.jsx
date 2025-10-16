import React, { useState } from "react";

const Layout = ({ children, user = null }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

<<<<<<< HEAD
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
=======
  // 🔹 Hàm đọc user từ localStorage
  const loadUser = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Khi Layout mount lần đầu → load user
    loadUser();

    // 🔹 Khi tab khác hoặc component khác cập nhật localStorage → tự cập nhật user
    const handleStorageChange = () => loadUser();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🔹 Khi user đăng nhập thành công ở Login.jsx → thông báo cho Layout
  useEffect(() => {
    const handleUserLogin = () => loadUser();
    window.addEventListener("userLogin", handleUserLogin);
    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, []);

  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
>>>>>>> 44066f8 (update)
  };

  return (
    <>
      <header className="header">
        <nav className="nav">
          <button 
            className="mobile-menu-btn" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>

          <div className="logo">
            <i className="fas fa-graduation-cap"></i>
            <span>EduLearn</span>
          </div>
<<<<<<< HEAD
          <ul className="nav-links">
=======

          <ul className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
>>>>>>> 44066f8 (update)
            <li>
              <a href="/" onClick={() => setMobileMenuOpen(false)}>Trang chủ</a>
            </li>
            <li>
              <a href="/courses" onClick={() => setMobileMenuOpen(false)}>Khóa học</a>
            </li>
            <li>
              <a href="/features" onClick={() => setMobileMenuOpen(false)}>Tính năng</a>
            </li>
            <li>
              <a href="/about" onClick={() => setMobileMenuOpen(false)}>Giới thiệu</a>
            </li>
            <li>
              <a href="/contact" onClick={() => setMobileMenuOpen(false)}>Liên hệ</a>
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
                  <a href="/profile">
                    <i className="fas fa-user"></i> Hồ sơ
                  </a>
                  <a href="/my-courses">
                    <i className="fas fa-book"></i> Khóa học của tôi
                  </a>
                  <a href="/settings">
                    <i className="fas fa-cog"></i> Cài đặt
                  </a>
                  {user.role === "admin" && (
                    <>
                      <div className="dropdown-divider"></div>
                      <div className="dropdown-label">Quản trị</div>
                      <a href="/admin/dashboard">
                        <i className="fas fa-tachometer-alt"></i> Dashboard
                      </a>
                      <a href="/admin/users">
                        <i className="fas fa-users"></i> Quản lý người dùng
                      </a>
                      <a href="/admin/courses">
                        <i className="fas fa-book-open"></i> Quản lý khóa học
                      </a>
                    </>
                  )}
<<<<<<< HEAD
                  <form method="POST" action="/logout">
                    <button type="submit" className="logout-btn">
                      Đăng xuất
                    </button>
                  </form>
=======
                  <div className="dropdown-divider"></div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="logout-btn"
                  >
                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                  </a>
>>>>>>> 44066f8 (update)
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
<<<<<<< HEAD
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
=======
            <div className="footer-logo">
              <i className="fas fa-graduation-cap"></i>
              <h3>EduLearn</h3>
            </div>
            <p className="footer-desc">
              Nền tảng học trực tuyến hàng đầu Việt Nam, mang đến hàng nghìn khóa học chất lượng cao từ các chuyên gia.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
>>>>>>> 44066f8 (update)
          </div>

          <div className="footer-section">
            <h3>Khám phá</h3>
            <ul className="footer-links">
              <li><a href="/courses"><i className="fas fa-chevron-right"></i> Khóa học</a></li>
              <li><a href="/features"><i className="fas fa-chevron-right"></i> Tính năng</a></li>
              <li><a href="/about"><i className="fas fa-chevron-right"></i> Về chúng tôi</a></li>
              <li><a href="/contact"><i className="fas fa-chevron-right"></i> Liên hệ</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Hỗ trợ</h3>
            <ul className="footer-links">
              <li><a href="#"><i className="fas fa-chevron-right"></i> Trung tâm trợ giúp</a></li>
              <li><a href="#"><i className="fas fa-chevron-right"></i> Điều khoản sử dụng</a></li>
              <li><a href="#"><i className="fas fa-chevron-right"></i> Chính sách bảo mật</a></li>
              <li><a href="#"><i className="fas fa-chevron-right"></i> Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Liên hệ</h3>
            <ul className="footer-contact">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>Đường Nguyễn Trác, Phường Dương Nội, TP. Hà Nội</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>support@edulearn.vn</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>1900-8888</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 EduLearn. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Chính sách</a>
              <span className="separator">|</span>
              <a href="#">Điều khoản</a>
              <span className="separator">|</span>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
