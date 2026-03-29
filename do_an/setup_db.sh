#!/bin/bash
# Script setup database QuanLyChungCu_DB
# Chạy: bash /home/vu/do_an/do_an/setup_db.sh

echo "=== Setup Database QuanLyChungCu_DB ==="

# Kết nối MySQL bằng sudo (không cần mật khẩu root MySQL)
sudo mysql << 'SQLEOF'

-- Xóa database cũ nếu có
DROP DATABASE IF EXISTS QuanLyChungCu_DB;

-- Tạo database mới
CREATE DATABASE QuanLyChungCu_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE QuanLyChungCu_DB;

-- Đặt mật khẩu cho root và tạo user cho dự án
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'vu.65890';
FLUSH PRIVILEGES;

-- 5.7 Lớp Tòa Nhà
CREATE TABLE ToaNha (
    MaToaNha VARCHAR(50) PRIMARY KEY,
    TenToaNha VARCHAR(255) NOT NULL,
    SoLuongPhong INT DEFAULT 0
);

-- 5.6 Lớp Phòng
CREATE TABLE Phong (
    MaPhong VARCHAR(50) PRIMARY KEY,
    SoPhong VARCHAR(50) NOT NULL,
    MaToaNha VARCHAR(50),
    TrangThai VARCHAR(100) DEFAULT 'Trống',
    DienTich FLOAT,
    FOREIGN KEY (MaToaNha) REFERENCES ToaNha(MaToaNha) ON DELETE SET NULL
);

-- 5.1 Lớp Người Dùng
CREATE TABLE NguoiDung (
    MaNguoiDung VARCHAR(50) PRIMARY KEY,
    TenDangNhap VARCHAR(100) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    VaiTro ENUM('admin', 'user', 'banquanly') DEFAULT 'user',
    TrangThai VARCHAR(50) DEFAULT 'Hoạt động',
    Email VARCHAR(255)
);

-- 5.2 Lớp Thông Tin Cư Dân
CREATE TABLE ThongTinCuDan (
    MaCuDan VARCHAR(50) PRIMARY KEY,
    HoTen VARCHAR(255) NOT NULL,
    SoDienThoai VARCHAR(20),
    CCCD VARCHAR(50) UNIQUE,
    QueQuan VARCHAR(255),
    MaPhong VARCHAR(50),
    MaNguoiDung VARCHAR(50),
    FOREIGN KEY (MaPhong) REFERENCES Phong(MaPhong) ON DELETE SET NULL,
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung) ON DELETE CASCADE
);

-- 5.3 Lớp Danh Sách Dịch Vụ
CREATE TABLE DanhSachDichVu (
    MaDichVu VARCHAR(50) PRIMARY KEY,
    TenDichVu VARCHAR(255) NOT NULL,
    DonGia DOUBLE NOT NULL,
    DonViTinh VARCHAR(50),
    LoaiDichVu INT COMMENT '1: Đo lường (Điện, Nước), 2: Cố định (Gửi xe, Rác)'
);

-- 5.5 Lớp Hóa Đơn
CREATE TABLE HoaDon (
    MaHoaDon VARCHAR(50) PRIMARY KEY,
    id_MaPhong VARCHAR(50),
    ThangThu VARCHAR(20),
    TongTien DOUBLE DEFAULT 0,
    TrangThai VARCHAR(50) DEFAULT 'Chưa thanh toán',
    NgayTao DATE,
    HanDongTien DATE,
    FOREIGN KEY (id_MaPhong) REFERENCES Phong(MaPhong) ON DELETE CASCADE
);

-- 5.4 Lớp Chỉ Số Dịch Vụ
CREATE TABLE ChiSoDichVu (
    MaGhi VARCHAR(50) PRIMARY KEY,
    id_MaDichVu VARCHAR(50),
    id_MaHoaDon VARCHAR(50),
    ChiSoLanGhiTruoc DOUBLE NULL,
    ChiSoHienTai DOUBLE NULL,
    SoLuong DOUBLE NULL,
    NgayGhi DATE,
    FOREIGN KEY (id_MaDichVu) REFERENCES DanhSachDichVu(MaDichVu) ON DELETE CASCADE,
    FOREIGN KEY (id_MaHoaDon) REFERENCES HoaDon(MaHoaDon) ON DELETE CASCADE
);

-- 5.8 Lớp Sự Cố
CREATE TABLE SuCo (
    MaSuCo VARCHAR(50) PRIMARY KEY,
    MaNguoiBao VARCHAR(50),
    MaPhong VARCHAR(50),
    NguoiXuly VARCHAR(50),
    TenSuCo VARCHAR(255) NOT NULL,
    MoTa TEXT,
    AnhSuCo TEXT,
    NgayBaoCao DATE,
    NgayXuLy DATE,
    TrangThai VARCHAR(50) DEFAULT 'Chờ duyệt',
    FOREIGN KEY (MaNguoiBao) REFERENCES NguoiDung(MaNguoiDung) ON DELETE CASCADE,
    FOREIGN KEY (MaPhong) REFERENCES Phong(MaPhong) ON DELETE CASCADE
);

-- Tạo tài khoản admin mặc định (mật khẩu: admin123)
INSERT INTO NguoiDung (MaNguoiDung, TenDangNhap, MatKhau, VaiTro, TrangThai, Email)
VALUES ('ND001', 'admin', '$2b$10$YourHashedPasswordHere', 'admin', 'Hoạt động', 'admin@chungcu.vn');

SELECT 'Database QuanLyChungCu_DB tao thanh cong!' AS KetQua;
SHOW TABLES;
SQLEOF

echo "✅ Xong! Mật khẩu root MySQL đã được đặt thành: vu.65890"
