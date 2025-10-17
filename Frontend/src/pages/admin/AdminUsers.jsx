import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Không lấy được danh sách người dùng");
      setUsers(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Xóa người dùng "${name}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleRole = async (id, currentRole, name) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Chuyển vai trò "${name}" thành ${newRole}?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Cập nhật vai trò thất bại");
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <section className="page-section">
        <div className="container">
          <div className="loading">Đang tải...</div>
        </div>
      </section>
    );

  if (error)
    return (
      <section className="page-section">
        <div className="container">
          <div className="alert alert-error">Lỗi: {error}</div>
        </div>
      </section>
    );

  // Tính thống kê
  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalRegularUsers = users.filter((u) => u.role === "user").length;

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-header">
          <h1 className="admin-title">
            <i className="fas fa-users-cog"></i>
            Quản lý người dùng
          </h1>
        </div>

        {/* Thống kê */}
        <div className="admin-grid">
          <div className="admin-card">
            <h3>Tổng số người dùng</h3>
            <span className="stat-number">{totalUsers}</span>
            <div className="stat-label">
              <i className="fas fa-users"></i>
              Tổng: {totalUsers} người dùng
            </div>
          </div>

          <div className="admin-card">
            <h3>Quản trị viên</h3>
            <span className="stat-number">{totalAdmins}</span>
            <div className="stat-label">
              <i className="fas fa-user-shield"></i>
              Admin: {totalAdmins}
            </div>
          </div>

          <div className="admin-card">
            <h3>Người dùng thường</h3>
            <span className="stat-number">{totalRegularUsers}</span>
            <div className="stat-label">
              <i className="fas fa-user"></i>
              User: {totalRegularUsers}
            </div>
          </div>
        </div>

        {/* Bảng danh sách */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === "admin" ? "badge-admin" : "badge-user"
                      }`}
                    >
                      {u.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleToggleRole(u._id, u.role, u.name)}
                    >
                      <i className="fas fa-exchange-alt"></i> Chuyển vai trò
                    </button>{" "}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(u._id, u.name)}
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

export default AdminUsers;
