import React, { useState } from "react";

const Login = ({ csrfToken = "", errorMessage = "", successMessage = "" }) => {
  const [showPassword, setShowPassword] = useState(false);

<<<<<<< HEAD
  const togglePassword = () => {
    setShowPassword(!showPassword);
=======
  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      // Gửi request đến backend
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      // ✅ Nếu thành công
      setMessage({ type: "success", text: "Đăng nhập thành công!" });
      console.log("Login success:", res.data);

      // Lưu token vào localStorage
      // ✅ Lưu token & user vào localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔔 Báo cho Layout biết user vừa đăng nhập để cập nhật menu ngay
      window.dispatchEvent(new Event("userLogin"));

      // ✅ Điều hướng sang trang home sau 1 giây
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err.response?.data);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Đăng nhập thất bại!",
      });
    }
>>>>>>> 44066f8 (update)
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

              {errorMessage && (
                <div className="alert alert-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle"></i>
                  {successMessage}
                </div>
              )}

              <form method="POST" action="/login" noValidate>
                <input type="hidden" name="_csrf" value={csrfToken} />

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
