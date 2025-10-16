import React from "react";

const Profile = ({ user }) => (
  <section className="profile">
    <div className="container">
      <h2 className="section-title">Thông tin cá nhân</h2>
      {user ? (
        <div className="profile-info">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="profile-avatar"
          />
          <h3>{user.name}</h3>
          <p>Email: {user.email}</p>
          <p>Ngày tham gia: {user.joinedDate}</p>
          <div className="profile-actions">
            <a href="/settings" className="btn btn-settings">
              Cài đặt
            </a>
          </div>
        </div>
      ) : (
        <p>Không tìm thấy thông tin người dùng.</p>
      )}
    </div>
  </section>
);

export default Profile;
