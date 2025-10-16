import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalRegularUsers: 0,
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Không lấy được thống kê");
      const users = await response.json();
      
      setStats({
        totalUsers: users.length,
        totalAdmins: users.filter(u => u.role === "admin").length,
        totalRegularUsers: users.filter(u => u.role === "user").length,
        recentUsers: users.slice(0, 5)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-header">
          <h1 className="admin-title">
            <i className="fas fa-tachometer-alt"></i>
            Dashboard Quản trị
          </h1>
        </div>

        {/* Thống kê */}
        <div className="admin-grid">
          <div className="admin-card">
            <h3>Tổng người dùng</h3>
            <span className="stat-number">{stats.totalUsers}</span>
            <div className="stat-label">
              <i className="fas fa-users"></i>
              Tất cả người dùng
            </div>
          </div>

          <div className="admin-card">
            <h3>Quản trị viên</h3>
            <span className="stat-number">{stats.totalAdmins}</span>
            <div className="stat-label">
              <i className="fas fa-user-shield"></i>
              Admin
            </div>
          </div>

          <div className="admin-card">
            <h3>Người dùng thường</h3>
            <span className="stat-number">{stats.totalRegularUsers}</span>
            <div className="stat-label">
              <i className="fas fa-user"></i>
              User
            </div>
          </div>
        </div>

        {/* Người dùng gần đây */}
        <div className="admin-table-wrap">
          <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-darker)" }}>
            <i className="fas fa-clock"></i> Người dùng gần đây
          </h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>
                      {u.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;