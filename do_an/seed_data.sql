USE apartment_db;

-- 1. Thêm Tòa Nhà
INSERT INTO ToaNha (MaToaNha, TenToaNha, SoLuongPhong) VALUES 
('TN01', 'Tòa A - Diamond', 50),
('TN02', 'Tòa B - Platinum', 50);

-- 2. Thêm Phòng
INSERT INTO Phong (MaPhong, SoPhong, MaToaNha, TrangThai, DienTich) VALUES 
('P101', 'A-101', 'TN01', 'Đã thuê', 75.5),
('P102', 'A-102', 'TN01', 'Trống', 65.0),
('P201', 'B-201', 'TN02', 'Đã thuê', 80.0);

-- 3. Thêm Người Dùng (Cư dân) - Mật khẩu giả định được hash (bcrypt 'matkhau123')
-- Chú ý: bcrypt hash cho 'matkhau123' có thể dùng: $2b$10$f6B0B68hG0G.XjFm9pW8.O9V8F/yS6C6kLp1W.z6fC.yB.G.Y.G.Y (giả lập)
INSERT INTO NguoiDung (MaNguoiDung, TenDangNhap, MatKhau, VaiTro, TrangThai, Email) VALUES 
('ND002', 'cu_dan_a', '$2b$10$f6B0B68hG0G.XjFm9pW8.O9V8F/yS6C6kLp1W.z6fC.', 'user', 'Hoạt động', 'cudan.a@gmail.com'),
('ND003', 'cu_dan_b', '$2b$10$f6B0B68hG0G.XjFm9pW8.O9V8F/yS6C6kLp1W.z6fC.', 'user', 'Hoạt động', 'cudan.b@gmail.com');

-- 4. Thêm Cư Dân
INSERT INTO ThongTinCuDan (MaCuDan, HoTen, SoDienThoai, CCCD, QueQuan, MaPhong, MaNguoiDung) VALUES 
('CD001', 'Nguyễn Văn A', '0901234567', '123456789012', 'Hà Nội', 'P101', 'ND002'),
('CD002', 'Trần Thị B', '0987654321', '987654321098', 'TP HCM', 'P201', 'ND003');

-- 5. Thêm Hóa Đơn (Phục vụ biểu đồ)
-- Doanh thu tháng 01/2026
INSERT INTO HoaDon (MaHoaDon, id_MaPhong, ThangThu, TongTien, TrangThai, NgayTao, HanDongTien) VALUES 
('HD001', 'P101', 'Tháng 01/2026', 1500000, 'Đã thanh toán', '2026-01-05', '2026-01-20'),
('HD002', 'P201', 'Tháng 01/2026', 1800000, 'Đã thanh toán', '2026-01-05', '2026-01-20');

-- Doanh thu tháng 02/2026
INSERT INTO HoaDon (MaHoaDon, id_MaPhong, ThangThu, TongTien, TrangThai, NgayTao, HanDongTien) VALUES 
('HD003', 'P101', 'Tháng 02/2026', 2100000, 'Đã thanh toán', '2026-02-05', '2026-02-20'),
('HD004', 'P201', 'Tháng 02/2026', 1650000, 'Đã thanh toán', '2026-02-05', '2026-02-20');

-- Doanh thu tháng 03/2026
INSERT INTO HoaDon (MaHoaDon, id_MaPhong, ThangThu, TongTien, TrangThai, NgayTao, HanDongTien) VALUES 
('HD005', 'P101', 'Tháng 03/2026', 3200000, 'Đã thanh toán', '2026-03-05', '2026-03-20'),
('HD006', 'P201', 'Tháng 03/2026', 2400000, 'Chưa thanh toán', '2026-03-05', '2026-03-20');
