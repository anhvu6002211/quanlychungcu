USE apartment_db;

-- 1. Xóa dữ liệu cũ nếu có
DELETE FROM ChiSoDichVu;
DELETE FROM DanhSachDichVu;
DELETE FROM SuCo;

-- 2. Thêm Danh Sách Dịch Vụ
INSERT INTO DanhSachDichVu (MaDichVu, TenDichVu, DonGia, DonViTinh, LoaiDichVu) VALUES
('DV001', 'Điện sinh hoạt', 3500, 'kWh', 1),
('DV002', 'Nước sinh hoạt', 12000, 'Khối', 2),
('DV003', 'Phí quản lý chung cư', 8000, 'm2', 3),
('DV004', 'Gửi xe máy', 100000, 'Tháng', 4),
('DV005', 'Gửi ô tô', 1200000, 'Tháng', 4);

-- 3. Thêm Chỉ Số Dịch Vụ (Liên kết HoaDon trong seed_data.sql)
-- Hoa đơn HD001 (Tháng 1 - P101)
INSERT INTO ChiSoDichVu (MaGhi, id_MaDichVu, id_MaHoaDon, ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi) VALUES
('CS001', 'DV001', 'HD001', 1200, 1350, 150, '2026-01-01'),
('CS002', 'DV002', 'HD001', 300, 315, 15, '2026-01-01');

-- Hoa đơn HD002 (Tháng 1 - P201)
INSERT INTO ChiSoDichVu (MaGhi, id_MaDichVu, id_MaHoaDon, ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi) VALUES
('CS003', 'DV001', 'HD002', 800, 910, 110, '2026-01-01'),
('CS004', 'DV002', 'HD002', 150, 162, 12, '2026-01-01');

-- Hoa đơn HD003 (Tháng 2 - P101)
INSERT INTO ChiSoDichVu (MaGhi, id_MaDichVu, id_MaHoaDon, ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi) VALUES
('CS005', 'DV001', 'HD003', 1350, 1520, 170, '2026-02-01'),
('CS006', 'DV002', 'HD003', 315, 333, 18, '2026-02-01');

-- Hoa đơn HD004 (Tháng 2 - P201)
INSERT INTO ChiSoDichVu (MaGhi, id_MaDichVu, id_MaHoaDon, ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi) VALUES
('CS007', 'DV001', 'HD004', 910, 1015, 105, '2026-02-01'),
('CS008', 'DV002', 'HD004', 162, 175, 13, '2026-02-01');

-- Hoa đơn HD005 (Tháng 3 - P101)
INSERT INTO ChiSoDichVu (MaGhi, id_MaDichVu, id_MaHoaDon, ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi) VALUES
('CS009', 'DV001', 'HD005', 1520, 1700, 180, '2026-03-01'),
('CS010', 'DV002', 'HD005', 333, 353, 20, '2026-03-01');

-- Hoa đơn HD006 (Tháng 3 - P201)
INSERT INTO ChiSoDichVu (MaGhi, id_MaDichVu, id_MaHoaDon, ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi) VALUES
('CS011', 'DV001', 'HD006', 1015, 1145, 130, '2026-03-01'),
('CS012', 'DV002', 'HD006', 175, 190, 15, '2026-03-01');

-- 4. Thêm Sự Cố Báo Cáo
INSERT INTO SuCo (MaSuCo, MaNguoiBao, MaPhong, NguoiXuly, TenSuCo, MoTa, NgayBaoCao, NgayXuLy, TrangThai) VALUES
('SC001', 'ND002', 'P101', 'admin', 'Vỡ ống nước nhà vệ sinh', 'Nước chảy lênh láng không khóa được nắp', '2026-03-10', '2026-03-11', 'Đã xử lý'),
('SC002', 'ND003', 'P201', NULL, 'Mát điện hành lang', 'Đèn hành lang bị chập chờn từ tối qua', '2026-04-12', NULL, 'Chờ xử lý'),
('SC003', 'ND002', 'P101', 'admin', 'Cửa sổ bị kẹt', 'Cửa sổ ban công bị rỉ sét không kéo ra được', '2026-02-15', '2026-02-16', 'Đã xử lý');
