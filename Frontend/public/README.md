# Public Assets

Thư mục này chứa các file static được serve trực tiếp.

## Cấu trúc:

```
public/
├── js/
│   └── settings.js        # Script cho password toggle và validation
├── uploads/
│   └── avatars/           # Thư mục chứa ảnh đại diện người dùng
├── favicon.ico            # Icon trang web
├── robots.txt             # File cho SEO
└── vite.svg              # Logo Vite mặc định
```

## Lưu ý:

- File trong thư mục `public/` được serve tại root path
- Ví dụ: `public/favicon.ico` → `http://localhost:5173/favicon.ico`
- Thư mục `uploads/avatars/` dùng để lưu ảnh đại diện do người dùng upload
- File `settings.js` được load trong `index.html` để xử lý các tính năng client-side
