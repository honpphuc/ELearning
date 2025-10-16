# 🎓 EduLearn - Nền tảng học trực tuyến

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Nền tảng học trực tuyến hiện đại được xây dựng với React và Vite, cung cấp trải nghiệm học tập tốt nhất cho học viên Việt Nam.

## ✨ Tính năng

- 📚 **Danh sách khóa học phong phú** - Hàng trăm khóa học chất lượng cao
- 👨‍🎓 **Hồ sơ người dùng** - Quản lý thông tin cá nhân và tiến độ học tập
- 💳 **Thanh toán trực tuyến** - Đăng ký khóa học nhanh chóng và an toàn
- 👨‍💼 **Admin Dashboard** - Quản lý người dùng và khóa học
- 📱 **Responsive Design** - Hoạt động mượt mà trên mọi thiết bị
- 🔐 **Authentication** - Đăng nhập/đăng ký an toàn
- 🎨 **Modern UI** - Giao diện đẹp mắt, dễ sử dụng

## 🚀 Bắt đầu nhanh

### Yêu cầu hệ thống

- Node.js 16+
- npm hoặc yarn

### Cài đặt

```bash
# Di chuyển vào thư mục client
cd client

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## 📦 Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build cho production
npm run preview      # Preview production build
npm run lint         # Chạy ESLint
```

## 🏗️ Cấu trúc dự án

```
client/
├── public/              # Static assets
│   ├── js/             # Client-side scripts
│   ├── uploads/        # User uploads
│   └── favicon.ico
├── src/
│   ├── components/     # Reusable components
│   │   └── Layout.jsx  # Header & Footer
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── ...
│   ├── App.jsx         # Main app with routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
└── package.json
```

## 🎨 Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** CSS3 với Variables
- **Icons:** Font Awesome 6
- **Fonts:** Google Fonts (Inter)

## 📱 Trang

### Trang công khai

- 🏠 Trang chủ - `/`
- 📚 Khóa học - `/courses`
- ℹ️ Giới thiệu - `/about`
- ✉️ Liên hệ - `/contact`
- ⭐ Tính năng - `/features`

### Trang người dùng

- 🔐 Đăng nhập - `/login`
- 📝 Đăng ký - `/register`
- 👤 Hồ sơ - `/profile`
- ⚙️ Cài đặt - `/settings`
- 📖 Khóa học của tôi - `/my-courses`
- 💳 Thanh toán - `/payment/:id`

### Trang Admin

- 📊 Dashboard - `/admin/dashboard`
- 👥 Quản lý người dùng - `/admin/users`
- 📚 Quản lý khóa học - `/admin/courses`

## 📄 Tài liệu

- [MIGRATION.md](MIGRATION.md) - Hướng dẫn migration từ EJS sang React
- [COMPLETE.md](COMPLETE.md) - Checklist đầy đủ về dự án

## 🎯 Roadmap

- [ ] Tích hợp backend API
- [ ] Xác thực JWT
- [ ] React Router cho routing nâng cao
- [ ] State management (Context API/Redux)
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] PWA support
- [ ] Dark mode
- [ ] Internationalization (i18n)

## 👥 Team

- **Team:** Nhóm 16
- **Course:** CSE702063 - Ứng Dụng Phân Tán
- **Semester:** N01

## 📞 Liên hệ

- Email: support@edulearn.vn
- GitHub: [@honpphuc](https://github.com/honpphuc)

---

Made with ❤️ by Nhóm 16
