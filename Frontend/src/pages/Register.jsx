import React, { useState } from "react";

const Register = ({
  csrfToken = "",
  errorMessage = "",
  successMessage = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }
    if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (password.length < 10) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const handlePasswordChange = (e) => {
    checkPasswordStrength(e.target.value);
  };

  return (
    <div className="register-page">
      {/* Register Form Section */}
      <section className="register-main">
        <div className="register-container">
          <div className="register-form-wrapper">
            <div className="register-form-card">
              <h2>Đăng ký tài khoản</h2>
              {errorMessage && (
                <div className="alert alert-error">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}

              <form
                method="POST"
                action="/register"
                noValidate
                className="register-form"
              >
                <input type="hidden" name="_csrf" value={csrfToken} />

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      Họ <span className="required">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      placeholder="Nguyễn"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">
                      Tên <span className="required">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      placeholder="Văn A"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    Mật khẩu <span className="required">*</span>
                  </label>
                  <div className="password-wrap">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Tối thiểu 8 ký tự"
                      required
                      autoComplete="new-password"
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      className="toggle-password icon-btn"
                      aria-label="Hiện/Ẩn mật khẩu"
                      onClick={togglePassword}
                    >
                      <i
                        className={`fa-solid ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                        aria-hidden="true"
                      ></i>
                    </button>
                  </div>
                  {passwordStrength && (
                    <div className="password-strength">
                      <div
                        className={`strength-bar strength-${passwordStrength}`}
                      >
                        <div className="strength-fill"></div>
                      </div>
                      <span
                        className={`strength-text strength-${passwordStrength}`}
                      >
                        {passwordStrength === "weak" && "Yếu"}
                        {passwordStrength === "medium" && "Trung bình"}
                        {passwordStrength === "strong" && "Mạnh"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password_confirmation">
                    Xác nhận mật khẩu <span className="required">*</span>
                  </label>
                  <div className="password-wrap">
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      name="password_confirmation"
                      placeholder="Nhập lại mật khẩu"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="toggle-password confirm icon-btn"
                      aria-label="Hiện/Ẩn mật khẩu"
                      onClick={toggleConfirmPassword}
                    >
                      <i
                        className={`fa-solid ${
                          showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                        aria-hidden="true"
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="form-group terms-group">
                  <label className="terms-checkbox">
                    <input type="checkbox" name="terms" required />
                    <span>
                      Tôi đồng ý với{" "}
                      <a href="/terms" target="_blank">
                        Điều khoản dịch vụ
                      </a>{" "}
                      và{" "}
                      <a href="/privacy" target="_blank">
                        Chính sách bảo mật
                      </a>
                    </span>
                  </label>
                </div>

                <button className="btn btn-register-submit" type="submit">
                  <i className="fas fa-user-plus"></i> Tạo tài khoản
                </button>
              </form>

              <div className="register-footer">
                <p>
                  Đã có tài khoản?{" "}
                  <a href="/login" className="login-link">
                    Đăng nhập ngay
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

export default Register;
