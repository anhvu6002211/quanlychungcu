CREATE TABLE IF NOT EXISTS `CauHinhPhiBaiXe` (
  `LoaiXe` varchar(50) NOT NULL PRIMARY KEY,
  `DonGia` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `BaiXe` (
  `MaTheXe` varchar(20) NOT NULL PRIMARY KEY,
  `BienSoXe` varchar(20) NOT NULL,
  `LoaiXe` varchar(50) NOT NULL,
  `MaCuDan` varchar(50) DEFAULT NULL,
  `NgayCap` datetime DEFAULT CURRENT_TIMESTAMP,
  `TrangThai` varchar(50) DEFAULT 'Đang sử dụng',
  CONSTRAINT `fk_baixe_loaixe` FOREIGN KEY (`LoaiXe`) REFERENCES `CauHinhPhiBaiXe` (`LoaiXe`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_baixe_cudan` FOREIGN KEY (`MaCuDan`) REFERENCES `ThongTinCuDan` (`MaCuDan`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `CauHinhPhiBaiXe` (`LoaiXe`, `DonGia`) VALUES
('Xe máy', 150000),
('Ô tô', 1200000),
('Xe đạp', 50000),
('Xe điện', 100000);

INSERT IGNORE INTO `BaiXe` (`MaTheXe`, `BienSoXe`, `LoaiXe`, `MaCuDan`, `NgayCap`, `TrangThai`) VALUES
('TX001', '29A-123.45', 'Ô tô', 'CD001', '2023-01-15 08:30:00', 'Đang sử dụng'),
('TX002', '29B1-567.89', 'Xe máy', 'CD001', '2023-02-20 09:15:00', 'Đang sử dụng'),
('TX003', '30F-999.99', 'Ô tô', 'CD002', '2023-05-10 14:00:00', 'Đang sử dụng'),
('TX004', '29X5-111.11', 'Xe máy', 'CD002', '2023-06-01 10:45:00', 'Mất thẻ');
