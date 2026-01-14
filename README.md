# Huyền Tình Dạ Trạch World

> *"Ngược dòng thời gian, tìm lại bản ngã trong thế giới Huyền Tình Dạ Trạch"*

Ứng dụng tạo ảnh 3D Chibi phong cách cổ trang Việt Nam, cho phép người dùng upload ảnh chân dung và ghép vào các nhân vật trong series phim **Huyền Tình Dạ Trạch**.

## ✨ Tính năng

- **19 mẫu nhân vật** - 9 mẫu đơn + 10 mẫu đôi (cặp)
- **Upload ảnh kép** - Hỗ trợ ghép 2 người vào các mẫu đôi
- **Thiết kế mobile-first** - Tối ưu trải nghiệm trên điện thoại
- **Giữ nguyên identity** - Bảo toàn đặc điểm khuôn mặt và tóc gốc
- **3D Chibi Style** - Phong cách render Pixar/Disney

## 🚀 Cài đặt

**Yêu cầu:** Node.js 18+

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm run dev
```

Truy cập: http://localhost:3000

## 📁 Cấu trúc dự án

```
├── App.tsx                    # Component chính
├── components/
│   ├── Header.tsx             # Header với branding
│   ├── UploadZone.tsx         # Upload ảnh chân dung
│   ├── ModelStyleSelector.tsx # Chọn nhân vật
│   └── ResultDisplay.tsx      # Hiển thị kết quả
├── data/
│   └── modelStyles.ts         # Dữ liệu 19 nhân vật
├── services/
│   ├── nkgService.ts          # Tích hợp NKG API
│   └── geminiService.ts       # Tích hợp Gemini (backup)
└── public/models/             # Ảnh nhân vật + thumbnails
```

## 🎭 Danh sách nhân vật

### Đơn (9 mẫu)
Chử Đồng Tử Sơ Khai, Già Làng, Hà Bảo Trân, Kiều Tiên, Thổ Phỉ, Tiên Dung, Triệu Lạc Tướng, Triệu Minh Lâm, Xương Cuồng

### Đôi (10 mẫu)
Chử Cù Vân, Chử Đồng Tử & Tiên Dung, Mẹ Con, Vua & Tiên Dung, Vua & Vợ Vua, Cha Cõng Con, Vua & Chử Đồng Tử, Vua Mời Rượu, Vua Gặp Chử Đồng Tử, Hoàng Hậu & Tiên Dung

## 📱 Screenshots

| Mobile | Desktop |
|--------|---------|
| Grid 5 cột, compact | Layout 2 cột với panel kết quả |

## 🔧 Cấu hình

Tạo file `.env.local`:

```env
NKG_API_URL=http://your-nkg-api-url/generate-multipart
```

## 📄 License

© 2024 Đài truyền hình Hà Nội
