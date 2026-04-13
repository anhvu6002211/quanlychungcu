# TÀI LIỆU YÊU CẦU PHẦN MỀM (SRS) - HỆ THỐNG QUẢN LÝ CHUNG CƯ

## 1. MỤC ĐÍCH TÀI LIỆU
Tài liệu SRS (Software Requirements Specification) này cung cấp bản mô tả toàn diện và chi tiết nhất về các chức năng, phi chức năng, và kiến trúc luồng dữ liệu của dự án "Hệ thống Quản lý Chung Cư". Tài liệu giúp đồng bộ hóa giữa source code thực tế đã viết và các báo cáo học thuật phục vụ bảo vệ đồ án.

## 2. TỔNG QUAN HỆ THỐNG
Dự án được xây dựng dưới dạng ứng dụng Web (SPA), chia làm 2 hệ thống chính:
* **Admin / Ban Quản Lý (BQL):** Quản lý tòa nhà, phòng, cư dân, dịch vụ, hóa đơn, bãi xe và xử lý các sự cố báo cáo từ cư dân.
* **Cư Dân (Resident):** Xem thông tin cá nhân, theo dõi các khoản phí (hóa đơn), báo cáo sự cố hư hỏng trong căn hộ, xem thông báo từ BQL và quản lý xe cộ.

## 3. CÁC MODULE VÀ YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

### 3.1. Phân hệ Quản lý Căn hộ & Cư dân
* **FR-01 (Quản lý Tòa nhà):** BQL có thể thêm, sửa, xóa thông tin tòa nhà (Mã Tòa, Tên Tòa) và theo dõi tổng dung lượng của Tòa.
* **FR-02 (Quản lý Phòng):** BQL có thể cấu hình số phòng, diện tích và gán phòng vào tòa nhà. Trạng thái phòng được tự động theo dõi (Trống / Đã thuê).
* **FR-03 (Quản lý Cư dân):** Cập nhật thông tin chi tiết cá nhân người thuê/mua. Gán cư dân vào một phòng cụ thể. Định danh qua CCCD chống trùng lặp.
* **FR-04 (Hợp đồng):** *(Dự kiến/Backlog)* Lưu trữ hồ sơ hợp đồng mua, bán, thuê, để xác nhận thời gian hiệu lực sở hữu phòng.

### 3.2. Phân hệ Tài chính - Dịch vụ
* **FR-05 (Quản lý Danh sách dịch vụ):** Linh hoạt thêm bớt các danh mục cấp phát cho cư dân, bao gồm Dịch vụ tính theo biến số đo lường (Điện, Nước) và Dịch vụ Cố định (Rác, Phí quản lý chung).
* **FR-06 (Chốt chỉ số hàng tháng):** Hệ thống cho phép BQL nhập chỉ số Điện/Nước hàng tháng cho mỗi căn hộ (Chỉ số cũ - Chỉ số mới) và tính tự động lượng tiêu thụ.
* **FR-07 (Xuất Hóa đơn):** Dựa trên mức tiêu thụ và giá tiền dịch vụ cấu hình trướcc để tự động chốt công nợ (Hóa đơn) theo tháng cho các căn hộ. Hóa đơn phản ánh tổng nợ.
* **FR-08 (Lịch sử thanh toán):** *(Dự kiến/Backlog)* Cập nhật và xuất được list các đợt trả tiền, nguồn tiền, hỗ trợ đối soát công nợ chi tiết minh bạch thay vì chỉ đổi trạng thái Đã/Chưa thanh toán.

### 3.3. Phân hệ Tương tác Cư dân
* **FR-09 (Báo cáo sự cố):** Cư dân chụp hình sự cố cơ sở hạ tầng (rò rỉ nước, hỏng đèn hành lang) gửi lên. Hệ thống tiếp nhận, tạo Ticket (Mã Sự Cố).
* **FR-10 (Xử lý sự cố):** BQL tiếp nhận Ticket, chuyển trạng thái "Chờ xử lý" -> "Đang xử lý" -> "Hoàn thành". Lưu trữ thông tin nhân sự chịu trách nhiệm.
* **FR-11 (Thông báo chung):** BQL tạo bài thông báo chung. Cư dân đăng nhập sẽ nhìn thấy ở trang giao diện của mình.
* **FR-12 (Quản lý Bãi xe):** Cư dân đăng nhập và submit biển số xe. Hệ thống tính phí đỗ xe tự động hàng tháng vào thẻ xe tương ứng.

## 4. DANH SÁCH API (RESTful Endpoints)
Dựa theo cấu trúc code đã hoàn thiện:
* **`/api/toanha`**: GET, POST, PUT, DELETE (Tòa nhà)
* **`/api/phong`**: GET, POST, PUT, DELETE (Phòng)
* **`/api/cudan`**: GET, POST, PUT, DELETE (Thông tin nội bộ Cư Dân)
* **`/api/nguoidung`**: Authentication, Đăng ký, Quản lý tài khoản (Admin, BanQuanLy, User)
* **`/api/danhsachdichvu`**: Các loại dịch vụ có trong chung cư
* **`/api/chisodichvu`**: API ghi nhận điện, nước hàng tháng
* **`/api/hoadon`**: Xuất và thay đổi trạng thái hóa đơn. Tính phí theo thuật toán bậc thang.
* **`/api/suco`**: Báo cáo sự cố & Update process.
* **`/api/baixe`**: Đăng ký và tính toán phí bãi xe (`/calculate-fee/:MaPhong`).
* **`/api/thongbao`**: Broadcast thông báo hệ thống chung.

## 5. CÔNG NGHỆ CHÍNH (TECH-STACK)
* **Frontend:** React, HTML5, CSS3, Vite.js.
* **Backend:** Node.js, Express.js. API RESTful chuẩn mực ứng dụng Middleware Routing.
* **Database:** RDBMS MySQL (InnoDB).
* **Authentication:** JWT Token. Mã hóa Data qua Bcrypt.
* **Realtime Services**: Socket.io cho Push Notification (đã triển khai).
