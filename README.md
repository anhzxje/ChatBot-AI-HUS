# 🤖 Chatbot AI HUS

**Phát triển bởi:** Sinh viên Trường Đại học Khoa học Tự nhiên – ĐHQGHN (HUS)

Ứng dụng Chatbot AI hỗ trợ đa phiên (multi-session), lưu trữ dữ liệu bền vững và tích hợp mô hình GPT. Hệ thống được xây dựng theo kiến trúc module, hướng dịch vụ (service-oriented), tập trung vào khả năng mở rộng và trải nghiệm người dùng.

---

## 📑 Mục lục

- [Phát triển Local](#-phát-triển-local)
- [Tính năng](#-tính-năng)
- [Thiết kế & UI/UX](#-thiết-kế--uiux)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Bảo mật](#-bảo-mật)
- [Khả năng mở rộng & hiệu năng](#-khả-năng-mở-rộng--hiệu-năng)
- [Lộ trình phát triển](#-lộ-trình-phát-triển)

---

## 🚀 Phát triển Local

### Yêu cầu hệ thống

- Docker & Docker Compose
- OpenAI API Key

### Các bước cài đặt

**1. Tạo file môi trường `.env`:**

**2. Build & khởi động hệ thống:**

```
npm start
```

**3. Ứng dụng chạy tại:**

`http://localhost:3000`

**4. Theo dõi log:**

```
docker compose logs -f
```

**Dừng ứng dụng:**

```
npm stop
```

---

## ✨ Tính năng

### 🎯 Chức năng cốt lõi

- Giao diện thời gian thực (streaming)
- Đăng ký/đăng nhập an toàn
- Lưu lịch sử toàn bộ các cuộc hội thoại
- Hỗ trợ đa phiên làm việc
- Persistence ổn định, không mất dữ liệu

### 🧠 Tích hợp AI

- Sử dụng mô hình GPT của OpenAI
- Abstraction GenAIClient → dễ mở rộng sang Gemini, Claude,...

---

## 🎨 Thiết kế & UI/UX

### Giao diện người dùng

- Thiết kế hiện đại dựa trên Material-UI
- Layout trực quan: chat area, input box, sidebar

### Trải nghiệm người dùng

- Cập nhật real-time
- Auto-scroll thông minh
- Feedback rõ ràng (loading, lỗi)
- Phiên đăng nhập tồn tại lâu dài

---

## 🏗 Kiến trúc hệ thống

### Cấu trúc dự án

- Module hóa rõ ràng: Client – Server – Data – Integration
- 100% TypeScript
- Docker Compose hỗ trợ môi trường phát triển

### Kiến trúc 3 tầng

#### 1. **Client (Frontend)**

- React + Material-UI  
- Redux (tách Data/UI)  
- Optimistic UI  

#### 2. **Server (Backend)**

- Express.js  
- Kiến trúc plugin  
- API RESTful có xác thực & xử lý lỗi đầy đủ  

#### 3. **Data Layer**

- MongoDB: lưu người dùng & hội thoại  
- Redis: quản lý session  
- Repository Pattern tách logic truy vấn dữ liệu  

### Hạ tầng

- Docker đảm bảo đồng nhất môi trường
- Triển khai:
  - Backend + Redis: Render Managed
  - Frontend: Render Static
  - Database: MongoDB Atlas

---

## 🔒 Bảo mật

### Xác thực dựa trên session

- Hash mật khẩu an toàn  
- Redis session siêu nhanh  
- Cookie bảo mật (Secure, HttpOnly, SameSite)

### Bảo mật hạ tầng

- Secret lưu trong `.env`  
- Log được làm sạch, không lộ thông tin nhạy cảm  

---

## 📈 Khả năng mở rộng & hiệu năng

### Tối ưu hiện tại

- Dockerization  
- Redis caching  
- Webpack bundle tối ưu  

### Lợi thế kiến trúc

- Loose-coupling (tách biệt các tầng)  
- MongoDB dễ scale ngang  
- render.yaml giúp IaC & triển khai tự động  

---

## 🚀 Lộ trình phát triển

### 🛠 Tính năng mới

- Hiển thị Markdown & code block đẹp hơn  
- Hỗ trợ upload file (multi-modal)  
- Xuất/Chia sẻ hội thoại  
- Tích hợp thêm Gemini, Claude  

### ⚡ Hiệu năng & kiểm thử

- Unit, Integration, E2E test  
- Tối ưu database  
- Rate limiting  
- Request caching  
- Giảm kích thước bundle  

### 🛡 Bảo mật & giám sát

- API Key Rotation  
- Cho phép user nhập API key riêng  
- Log tối ưu và dễ giám sát  
- Tích hợp Datadog hoặc hệ thống quan sát khác  

---