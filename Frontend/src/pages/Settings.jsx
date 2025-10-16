import React, { useState } from "react";

const Settings = ({
  user = { name: "", email: "", avatar: "" },
  csrfToken = "",
  errorMessage = "",
  successMessage = "",
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const scorePassword = (pass) => {
    if (!pass) return 0;
    let score = 0;
    score += Math.min(10, pass.length) * 6;
    if (/[a-z]/.test(pass)) score += 10;
    if (/[A-Z]/.test(pass)) score += 10;
    if (/[0-9]/.test(pass)) score += 10;
    if (/[^A-Za-z0-9]/.test(pass)) score += 10;
    return Math.min(100, score);
  };

  const getPasswordStrength = (score) => {
    if (score > 80) return { label: "Rất mạnh", color: "green" };
    if (score > 60) return { label: "Mạnh", color: "blue" };
    if (score > 40) return { label: "Trung bình", color: "orange" };
    return { label: "Yếu", color: "red" };
  };

  const passwordScore = scorePassword(newPassword);
  const passwordStrength = getPasswordStrength(passwordScore);
  const passwordsMatch = confirmPassword && newPassword === confirmPassword;

  return (
    <div className="container settings-page">
      <div className="settings-grid">
        <aside className="settings-aside">
          <h2>Xem trước hồ sơ</h2>
          <div className="preview-card">
            {user.avatar ? (
              <img src={user.avatar} className="avatar-img" alt="avatar" />
            ) : (
              <div className="avatar-fallback small">
                <i className="fas fa-user"></i>
              </div>
            )}
            <h3>{user.name}</h3>
            <p className="muted">{user.email}</p>
            <a href="/profile" className="btn">
              Xem hồ sơ
            </a>
          </div>
        </aside>

        <section className="settings-main">
          <h1>Cài đặt tài khoản</h1>

          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          <form
            action="/settings"
            method="post"
            encType="multipart/form-data"
            className="settings-form"
          >
            <input type="hidden" name="_csrf" value={csrfToken} />

            <div className="form-row">
              <label htmlFor="name">Tên</label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="avatar">
                Avatar (jpg, png, gif) — tối đa 2MB
              </label>
              <input id="avatar" name="avatar" type="file" accept="image/*" />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn">
                Lưu thay đổi
              </button>
              <a href="/profile" className="btn btn-secondary">
                Hủy
              </a>
            </div>
          </form>

          <hr />

          <div className="card password-card" aria-labelledby="pw-heading">
            <h2 id="pw-heading">Đổi mật khẩu</h2>

            <form
              action="/settings/password"
              method="post"
              className="settings-form"
              aria-describedby="pw-help"
            >
              <input type="hidden" name="_csrf" value={csrfToken} />
              <div id="pw-help" className="sr-only">
                Mật khẩu mới phải có ít nhất 8 ký tự.
              </div>

              <div className="pw-grid">
                <div className="pw-item">
                  <label htmlFor="current_password">Mật khẩu hiện tại</label>
                  <div className="pw-wrap">
                    <input
                      id="current_password"
                      name="current_password"
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      aria-required="true"
                    />
                    <button
                      type="button"
                      className="pw-toggle"
                      aria-label={
                        showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      <i
                        className={`fas ${
                          showCurrentPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="pw-item">
                  <label htmlFor="new_password">Mật khẩu mới</label>
                  <div className="pw-wrap">
                    <input
                      id="new_password"
                      name="new_password"
                      type={showNewPassword ? "text" : "password"}
                      minLength="8"
                      required
                      aria-required="true"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="pw-toggle"
                      aria-label={
                        showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <i
                        className={`fas ${
                          showNewPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                    {newPassword && (
                      <div
                        className="pw-meter"
                        id="pw-meter"
                        aria-hidden="true"
                      >
                        <div
                          className="pw-meter-bar"
                          style={{
                            width: `${passwordScore}%`,
                            backgroundColor: passwordStrength.color,
                          }}
                        ></div>
                        <div className="pw-meter-text">
                          {passwordStrength.label}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pw-item">
                  <label htmlFor="new_password_confirm">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="pw-wrap">
                    <input
                      id="new_password_confirm"
                      name="new_password_confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      minLength="8"
                      required
                      aria-required="true"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="pw-toggle"
                      aria-label={
                        showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <i
                        className={`fas ${
                          showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                    {confirmPassword && (
                      <div
                        className="pw-match"
                        id="pw-match"
                        aria-live="polite"
                        style={{
                          color: passwordsMatch ? "green" : "red",
                          marginTop: "8px",
                        }}
                      >
                        {passwordsMatch ? "Khớp" : "Không khớp"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="form-actions"
                style={{ justifyContent: "flex-end" }}
              >
                <button type="submit" className="btn btn-danger">
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
