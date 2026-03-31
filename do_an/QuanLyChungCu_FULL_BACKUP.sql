mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: QuanLyChungCu_DB
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ChiSoDichVu`
--

DROP TABLE IF EXISTS `ChiSoDichVu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ChiSoDichVu` (
  `MaGhi` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_MaDichVu` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_MaHoaDon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ChiSoLanGhiTruoc` double DEFAULT NULL,
  `ChiSoHienTai` double DEFAULT NULL,
  `SoLuong` double DEFAULT NULL,
  `NgayGhi` date DEFAULT NULL,
  PRIMARY KEY (`MaGhi`),
  KEY `id_MaDichVu` (`id_MaDichVu`),
  KEY `id_MaHoaDon` (`id_MaHoaDon`),
  CONSTRAINT `ChiSoDichVu_ibfk_1` FOREIGN KEY (`id_MaDichVu`) REFERENCES `DanhSachDichVu` (`MaDichVu`) ON DELETE CASCADE,
  CONSTRAINT `ChiSoDichVu_ibfk_2` FOREIGN KEY (`id_MaHoaDon`) REFERENCES `HoaDon` (`MaHoaDon`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChiSoDichVu`
--

LOCK TABLES `ChiSoDichVu` WRITE;
/*!40000 ALTER TABLE `ChiSoDichVu` DISABLE KEYS */;
/*!40000 ALTER TABLE `ChiSoDichVu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DanhSachDichVu`
--

DROP TABLE IF EXISTS `DanhSachDichVu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DanhSachDichVu` (
  `MaDichVu` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenDichVu` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DonGia` double NOT NULL,
  `DonViTinh` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LoaiDichVu` int DEFAULT NULL COMMENT '1: Đo lường (Điện, Nước), 2: Cố định (Gửi xe, Rác)',
  PRIMARY KEY (`MaDichVu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DanhSachDichVu`
--

LOCK TABLES `DanhSachDichVu` WRITE;
/*!40000 ALTER TABLE `DanhSachDichVu` DISABLE KEYS */;
/*!40000 ALTER TABLE `DanhSachDichVu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HoaDon`
--

DROP TABLE IF EXISTS `HoaDon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HoaDon` (
  `MaHoaDon` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_MaPhong` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ThangThu` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TongTien` double DEFAULT '0',
  `TrangThai` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Chưa thanh toán',
  `NgayTao` date DEFAULT NULL,
  `HanDongTien` date DEFAULT NULL,
  PRIMARY KEY (`MaHoaDon`),
  KEY `id_MaPhong` (`id_MaPhong`),
  CONSTRAINT `HoaDon_ibfk_1` FOREIGN KEY (`id_MaPhong`) REFERENCES `Phong` (`MaPhong`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HoaDon`
--

LOCK TABLES `HoaDon` WRITE;
/*!40000 ALTER TABLE `HoaDon` DISABLE KEYS */;
/*!40000 ALTER TABLE `HoaDon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NguoiDung`
--

DROP TABLE IF EXISTS `NguoiDung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NguoiDung` (
  `MaNguoiDung` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenDangNhap` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MatKhau` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `VaiTro` enum('admin','user','banquanly') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `TrangThai` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Hoạt động',
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaNguoiDung`),
  UNIQUE KEY `TenDangNhap` (`TenDangNhap`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NguoiDung`
--

LOCK TABLES `NguoiDung` WRITE;
/*!40000 ALTER TABLE `NguoiDung` DISABLE KEYS */;
/*!40000 ALTER TABLE `NguoiDung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Phong`
--

DROP TABLE IF EXISTS `Phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Phong` (
  `MaPhong` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoPhong` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaToaNha` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TrangThai` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Trống',
  `DienTich` float DEFAULT NULL,
  PRIMARY KEY (`MaPhong`),
  KEY `MaToaNha` (`MaToaNha`),
  CONSTRAINT `Phong_ibfk_1` FOREIGN KEY (`MaToaNha`) REFERENCES `ToaNha` (`MaToaNha`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Phong`
--

LOCK TABLES `Phong` WRITE;
/*!40000 ALTER TABLE `Phong` DISABLE KEYS */;
/*!40000 ALTER TABLE `Phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SuCo`
--

DROP TABLE IF EXISTS `SuCo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SuCo` (
  `MaSuCo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaNguoiBao` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MaPhong` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NguoiXuly` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TenSuCo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MoTa` text COLLATE utf8mb4_unicode_ci,
  `AnhSuCo` text COLLATE utf8mb4_unicode_ci,
  `NgayBaoCao` date DEFAULT NULL,
  `NgayXuLy` date DEFAULT NULL,
  `TrangThai` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Chờ duyệt',
  PRIMARY KEY (`MaSuCo`),
  KEY `MaNguoiBao` (`MaNguoiBao`),
  KEY `MaPhong` (`MaPhong`),
  CONSTRAINT `SuCo_ibfk_1` FOREIGN KEY (`MaNguoiBao`) REFERENCES `NguoiDung` (`MaNguoiDung`) ON DELETE CASCADE,
  CONSTRAINT `SuCo_ibfk_2` FOREIGN KEY (`MaPhong`) REFERENCES `Phong` (`MaPhong`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SuCo`
--

LOCK TABLES `SuCo` WRITE;
/*!40000 ALTER TABLE `SuCo` DISABLE KEYS */;
/*!40000 ALTER TABLE `SuCo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ThongTinCuDan`
--

DROP TABLE IF EXISTS `ThongTinCuDan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ThongTinCuDan` (
  `MaCuDan` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HoTen` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoDienThoai` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CCCD` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `QueQuan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MaPhong` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MaNguoiDung` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaCuDan`),
  UNIQUE KEY `CCCD` (`CCCD`),
  KEY `MaPhong` (`MaPhong`),
  KEY `MaNguoiDung` (`MaNguoiDung`),
  CONSTRAINT `ThongTinCuDan_ibfk_1` FOREIGN KEY (`MaPhong`) REFERENCES `Phong` (`MaPhong`) ON DELETE SET NULL,
  CONSTRAINT `ThongTinCuDan_ibfk_2` FOREIGN KEY (`MaNguoiDung`) REFERENCES `NguoiDung` (`MaNguoiDung`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ThongTinCuDan`
--

LOCK TABLES `ThongTinCuDan` WRITE;
/*!40000 ALTER TABLE `ThongTinCuDan` DISABLE KEYS */;
/*!40000 ALTER TABLE `ThongTinCuDan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ToaNha`
--

DROP TABLE IF EXISTS `ToaNha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ToaNha` (
  `MaToaNha` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenToaNha` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoLuongPhong` int DEFAULT '0',
  PRIMARY KEY (`MaToaNha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ToaNha`
--

LOCK TABLES `ToaNha` WRITE;
/*!40000 ALTER TABLE `ToaNha` DISABLE KEYS */;
/*!40000 ALTER TABLE `ToaNha` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-28 17:33:29
