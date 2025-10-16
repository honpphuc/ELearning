import React from "react";

const AdminUsers = ({ users = [] }) => (
  <section className="page-section">
    <div className="container">
      <h1 className="admin-title">Quản lý người dùng</h1>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Tạo lúc</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.created_at).toLocaleString("vi-VN")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", color: "#718096" }}
                >
                  Chưa có người dùng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default AdminUsers;
