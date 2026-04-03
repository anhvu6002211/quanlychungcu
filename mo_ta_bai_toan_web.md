# Mô tả bài toán: Hệ thống Quản lý Chung Cư

## 1. Giới thiệu tổng quan
Hệ thống "Quản lý Chung Cư" (Apartment Management System) là một ứng dụng web (Web App) được thiết kế để số hóa và tối ưu hóa quy trình quản lý, vận hành của một tòa nhà chung cư hoặc cụm chung cư. Hệ thống phục vụ hai nhóm đối tượng chính: **Ban quản lý (Admin/BanQuanLy)** và **Cư dân (User)**. 

Mục tiêu chính của hệ thống là giúp ban quản lý dễ dàng nắm bắt tình trạng số liệu cư dân, cơ sở vật chất, thu phí dịch vụ điện nước, và tiếp nhận các báo cáo sự cố từ cư dân một cách nhanh chóng. Đồng thời, cư dân cũng có một kênh minh bạch để xem thông tin hóa đơn, báo cáo sự cố hư hỏng trong căn hộ, và theo dõi quá trình xử lý.

## 2. Kiến trúc giải pháp (Tech Stack)
*   **Chỉnh thể:** Single Page Application (SPA)
*   **Frontend:** ReactJS (Vite), giao diện người dùng hiển thị thông tin, trang chủ, dashboard tổng quan. Giao tiếp với backend qua REST API và Socket.io (realtime).
*   **Backend:** Node.js, Express.js. Xử lý logic, xác thực người dùng (JWT), và quản lý kết nối Socket.io để đẩy thông báo thời gian thực.
*   **Database:** MySQL. Lưu trữ dữ liệu cấu trúc (người dùng, tòa nhà, căn hộ, hóa đơn...).

## 3. Các thực thể (Entities) và Module chính

### 3.1. Quản lý Người dùng và Phân quyền (NguoiDung)
*   Hệ thống có nhiều vai trò (Role): `admin`, `banquanly`, `user`.
*   Tài khoản đăng nhập được mã hóa mật khẩu an toàn (Bcrypt).
*   Mỗi tài khoản `user` sẽ được liên kết với một thông tin cư dân cụ thể.

### 3.2. Quản lý Cơ sở Vật chất (ToaNha, Phong)
*   **Tòa nhà:** Quản lý danh sách các tòa nhà (Ví dụ: Tòa A - Diamond, Tòa B - Platinum), tổng số lượng phòng.
*   **Phòng/Căn hộ:** Nằm thuộc các tòa nhà. Lưu trữ diện tích, mã phòng, và trạng thái hiện tại (Đã thuê, Trống).

### 3.3. Quản lý Cư dân (ThongTinCuDan)
*   Lưu trữ thông tin chi tiết của người cư ngụ: Họ tên, Số điện thoại, CCCD, Quê quán.
*   Theo dõi cư dân đang ở tại Phòng/Căn hộ nào và liên kết với mã tài khoản để họ có thể đăng nhập xem thông tin.

### 3.4. Quản lý Dịch vụ và Chỉ số khối lượng (DanhSachDichVu, ChiSoDichVu)
*   **Danh sách dịch vụ:** Cấu hình các loại hình dịch vụ thu phí định kỳ. Có 2 loại hình chính: 
    *   Dịch vụ đo lường có chỉ số (Ví dụ: Điện, Nước).
    *   Dịch vụ cố định (Ví dụ: Rác, Gửi xe).
*   **Chỉ số dịch vụ:** Ghi nhận số liệu tiêu thụ (chỉ số cũ, chỉ số mới, số lượng tiêu thụ) của từng dịch vụ cho mỗi phòng theo tháng.

### 3.5. Quản lý Tài chính, Hóa đơn (HoaDon)
*   Tổng hợp các chi phí của một căn hộ trong từng tháng để xuất hóa đơn.
*   Lưu trữ tổng tiền, ngày tạo, hạn đóng tiền, và trạng thái thanh toán (Chưa thanh toán, Đã thanh toán).
*   Dữ liệu này được dùng làm đầu vào cho Dashboard thống kê (Biểu đồ doanh thu hàng tháng).

### 3.6. Quản lý Sự cố và Phản hồi (SuCo)
*   Cư dân có thể gửi báo cáo sự cố (Ví dụ: rò rỉ nước, hỏng điều hòa...) kèm mô tả và hình ảnh minh họa.
*   Ban quản lý tiếp nhận, phân công người xử lý và cập nhật trạng thái (Chờ duyệt, Đang xử lý, Đã hoàn thành). 
*   Ghi nhận ngày báo cáo, ngày xử lý hoàn tất để đo lường KPI vận hành.

## 4. Ứng dụng để Huấn luyện Chatbot

Với tập dữ liệu bài toán trên, Chatbot của hệ thống (nếu có) có thể được huấn luyện để thực hiện các nghiệp vụ:
1.  **Hỗ trợ Cư dân:** 
    *   Truy vấn hóa đơn tháng này là bao nhiêu? Đã thanh toán hay chưa?
    *   Hướng dẫn cách gửi báo cáo sự cố kỹ thuật.
    *   Cung cấp thông tin số điện thoại hotline của ban quản lý.
2.  **Hỗ trợ Ban Quản Lý:**
    *   Truy vấn nhanh: "Có bao nhiêu căn hộ đang trống ở Tòa A?"
    *   Tra cứu thông tin chủ hộ dựa trên Số phòng.
    *   Thống kê: "Tổng doanh thu tiền dịch vụ tháng 02/2026 là bao nhiêu?"
    *   Liệt kê các sự cố "Chờ duyệt" cần phân công gấp.

Bằng cách nhúng nội dung mô tả cấu trúc DB và luồng nghiệp vụ này vào *System Prompt* của mô hình LLM (như Assistant hoặc RAG flow), chatbot sẽ có đủ ngữ cảnh để hiểu và trả lời chính xác các câu hỏi xoay quanh hệ thống Quản lý Chung Cư này.
