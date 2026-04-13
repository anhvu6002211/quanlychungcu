# Hệ thống Quản lý Chung Cư Cao Cấp (Leon Home)

Leon Home là giải pháp chuyển đổi số toàn diện dành cho Ban Quản Lý đô thị và Cộng đồng Sinh sống, được thiết kế nhằm mục đích tăng tốc các quy trình nghiệp vụ vốn mất nhiều thời gian, đảm bảo tính minh bạch về thu chi tài chính và duy trì môi trường sống hiện đại, an toàn.

## 🌟 Tính năng nổi bật (Key Features)

* **Real-time Notifications**: Thông báo sự cố, bảo trì cho các Khu dân cư được phát song song qua WebSocket (Trải nghiệm thời gian thực, không cần tải lại trang).
* **Thuật toán tính tiền điện bậc thang Zero-Trust**: Toàn bộ luồng hóa đơn của căn hộ được Backend kiểm soát với Module Billing Service cô lập. Ngăn chặn triệt để hành động sửa đổi tổng tiền sai trái, chỉ chấp nhận đầu vào là dãy thông số công tơ điện nước.
* **Biểu đồ thống kê rành mạch (Dashboard)**: Tích hợp thư viện đồ thị hiện đại, khái quát doanh thu tài chính theo phân luồng Dịch vụ/Căn hộ một cách cực kỳ tường minh.
* **Xuất PDF & Invoice Printing**: Tự động chuyển đổi số liệu hệ thống thành Form Báo Cáo A4 theo thời gian thực. Sẵn sàng ấn để tải về file PDF hoặc đưa vào luồng Máy in Cứng.

## 🛠 Công nghệ sử dụng (Tech Stack)

* **Frontend**: ReactJS (Vite), CSS3, Framer Motion, Axios, React-to-print. 
* **Backend**: Node.js, Express.js.
* **Môi trường Thời gian thực (Real-time)**: Socket.io
* **Cơ sở dữ liệu**: MySQL / MariaDB (Bộ truy vấn gốc).

## 📂 Trúc thư mục ngắn gọn (Project Structure)

```text
leon-home-apartment/
├── do_an/                    # [Backend] Node.js REST API
│   ├── src/
│   │   ├── config/           # Setup kết nối Database, JWT... 
│   │   ├── controllers/      # Cầu nối (Điều phối request-response)
│   │   ├── middlewares/      # Security (Helmet, RateLimit), Auth Validate
│   │   ├── routes/           # Khai báo tuyến đường API HTTP
│   │   ├── services/         # Chứa Logic nghiệp vụ cô lập (VD: billingService.js)
│   │   └── validations/      # Joi schema cho zero-trust input
│   └── server.js             # Entry point & Setup Websocket
│
└── frontend/                 # [Frontend] React UI
    ├── src/
    │   ├── components/       # Các Module dùng chung (Sidebar, Navbar, Print Templates)
    │   ├── pages/            # Các màn hình Cư dân, Hóa Đơn, Sự cố...
    │   ├── services/         # Kết nối API Axios & Singleton Socket.js
    │   └── App.jsx           # App Routing Center
    └── package.json
```

## 🚀 Hướng dẫn cài đặt (Installation Guide)

### 1. Yêu cầu Cài đặt (Prerequisites)
- Đảm bảo máy tính đã thiết lập vòng môi trường: **Node.js (>=18.x)** và **MySQL Server**.

### 2. Thiết lập Backend
```bash
# 1. Di chuyển vào thư mục backend
cd do_an

# 2. Cài đặt các gói NPM
npm install

# 3. Import File SQL
# Hãy sử dụng phần mềm như Navicat, DBeaver hoặc MySQL CLI để Import file `QuanLyChungCu_FULL_BACKUP.sql`

# 4. Cấu hình Biến môi trường
# Tạo file .env và tham chiếu thông số DB (Tên database, user, password, Port) của bạn

# 5. Khởi động Server (Dev mode)
npm run dev
# Server sẽ khởi chạy tại cổng mặc định (ví dụ: port 3000)
```

### 3. Thiết lập Frontend
```bash
# 1. Tự thân hoặc mở tab Terminal mới rồi di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt các gói phụ thuộc Web
npm install

# 3. Chạy môi trường Frontend 
npm run dev
# React Vite sẽ start tại localhost:5173
```

> **Lưu ý:** Nếu khi chạy môi trường mà xuất hiện lỗi CORS thì cần đảm bảo `SOCKET_URL` và `API_URL` phía FE trỏ đúng đến Port backend đang phục vụ.
