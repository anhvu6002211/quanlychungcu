-- Create ThongBao table
CREATE TABLE IF NOT EXISTS `ThongBao` (
  `MaThongBao` varchar(20) NOT NULL PRIMARY KEY,
  `TieuDe` varchar(255) NOT NULL,
  `NoiDung` text,
  `LoaiThongBao` varchar(50) DEFAULT 'Chung',
  `NguoiDang` varchar(50) DEFAULT NULL,
  `NgayDang` datetime DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_thongbao_nguoidung` FOREIGN KEY (`NguoiDang`) REFERENCES `NguoiDung` (`MaNguoiDung`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Populate ThongBao
INSERT IGNORE INTO `ThongBao` (`MaThongBao`, `TieuDe`, `NoiDung`, `LoaiThongBao`, `NguoiDang`, `NgayDang`) VALUES
('TB001', 'Thông báo lịch cắt nước sinh hoạt', 'Ban quản lý xin thông báo, vào 8h00 - 12h00 sáng chủ nhật tuần này sẽ tiến hành cắt nước để vệ sinh bể ngầm.', 'Bảo trì', 'ND001', '2023-10-10 10:00:00'),
('TB002', 'Đóng phí quản lý tháng tới', 'Yêu cầu toàn bộ cư dân đóng phí quản lý trước ngày 15.', 'Chung', 'ND001', '2023-10-01 08:00:00'),
('TB003', 'Họp ban quản trị cư dân cuối năm', 'Buổi họp tổng kết thường niên khu dân cư sẽ diễn ra vào lúc 19:00 thứ Bảy tuần tới tại hội trường tầng 1.', 'Sự kiện', 'ND001', '2023-10-15 09:30:00'),
('TB004', 'Bảo trì hệ thống PCCC', 'Kỹ thuật tòa nhà sẽ tiến hành thử chuông và kiểm tra bình chữa cháy định kỳ. Mong quý Cư dân không hoảng loạn.', 'Bảo trì', 'ND001', '2023-10-18 14:00:00');

-- Add some more data to Phong (Assuming TN01, TN02 exists)
INSERT IGNORE INTO `Phong` (`MaPhong`, `SoPhong`, `MaToaNha`, `TrangThai`, `DienTich`) VALUES
('P201', '201', 'TN01', 'Đã thuê', 85.00),
('P202', '202', 'TN01', 'Đã bán', 70.50),
('P203', '203', 'TN01', 'Trống', 90.00),
('P301', '301', 'TN02', 'Đã bán', 105.00);

-- Add some more data to ThongTinCuDan
INSERT IGNORE INTO `ThongTinCuDan` (`MaCuDan`, `HoTen`, `SoDienThoai`, `CCCD`, `QueQuan`, `MaPhong`, `MaNguoiDung`) VALUES
('CD003', 'Lê Thành C', '0903333333', '001099012345', 'Hà Nội', 'P201', NULL),
('CD004', 'Phạm Thị D', '0904444444', '001099054321', 'Hải Phòng', 'P202', NULL);

-- Add mock data for HoaDon (Billing) to make finance module testable
INSERT IGNORE INTO `HoaDon` (`MaHoaDon`, `id_MaPhong`, `ThangThu`, `TongTien`, `TrangThai`, `NgayTao`, `HanDongTien`) VALUES
('HD001', 'P101', '08/2023', 1500000, 'Đã thanh toán', '2023-08-01 08:00:00', '2023-08-15'),
('HD002', 'P102', '08/2023', 1200000, 'Đã thanh toán', '2023-08-01 08:00:00', '2023-08-15'),
('HD003', 'P101', '09/2023', 1800000, 'Đã thanh toán', '2023-09-01 08:00:00', '2023-09-15'),
('HD004', 'P102', '09/2023', 1400000, 'Chưa thanh toán', '2023-09-01 08:00:00', '2023-09-15'),
('HD005', 'P101', '10/2023', 1600000, 'Đang chờ xử lý', '2023-10-01 08:00:00', '2023-10-15'),
('HD006', 'P201', '10/2023', 2100000, 'Đã thanh toán', '2023-10-01 08:00:00', '2023-10-15'),
('HD007', 'P202', '10/2023', 850000, 'Chưa thanh toán', '2023-10-01 08:00:00', '2023-10-15');
