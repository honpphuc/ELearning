import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Đăng nhập thất bại!");
      }

      // Lưu token & user vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Báo cho Layout biết user vừa đăng nhập
      window.dispatchEvent(new Event("userLogin"));

      setMessage({ type: "success", text: "Đăng nhập thành công!" });

      // Điều hướng sang trang home sau 1 giây
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Đăng nhập thất bại!",
      });
    }
  };

  return (
    <div className="login-page">
      {/* Main Login Section */}
      <section className="login-main">
        <div className="login-container">
          <div className="login-form-wrapper">
            <div className="login-form-card">
              <div className="login-form-header">
                <h2>Đăng nhập</h2>
                <p>Nhập thông tin tài khoản của bạn</p>
              </div>

              {message.type === "error" && (
                <div className="alert alert-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {message.text}
                </div>
              )}
              {message.type === "success" && (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle"></i>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fas fa-envelope"></i>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <i className="fas fa-lock"></i>
                    Mật khẩu
                  </label>
                  <div className="password-wrap">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      aria-label="Hiện/Ẩn mật khẩu"
                      onClick={togglePassword}
                    >
                      <i
                        className={`fa-solid ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" name="remember" />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <a href="/forgot-password" className="forgot-link">
                    Quên mật khẩu?
                  </a>
                </div>

                <button className="btn btn-primary btn-login" type="submit">
                  <i className="fas fa-sign-in-alt"></i>
                  Đăng nhập
                </button>
              </form>

              <div className="login-footer">
                <p>
                  Chưa có tài khoản?{" "}
                  <a href="/register" className="register-link">
                    Đăng ký ngay
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
