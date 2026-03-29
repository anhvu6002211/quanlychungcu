const db = require('../config/db.config');

const DanhSachDichVuModel = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM DanhSachDichVu');
        return rows;
    },

    getByMa: async (MaDichVu) => {
        const [rows] = await db.query('SELECT * FROM DanhSachDichVu WHERE MaDichVu = ?', [MaDichVu]);
        return rows[0];
    },

    // Lọc theo loại (1: Đo lường, 2: Cố định)
    getByLoai: async (LoaiDichVu) => {
        const [rows] = await db.query('SELECT * FROM DanhSachDichVu WHERE LoaiDichVu = ?', [LoaiDichVu]);
        return rows;
    },

    create: async (data) => {
        const { MaDichVu, TenDichVu, DonGia, DonViTinh, LoaiDichVu } = data;
        const [result] = await db.query(
            'INSERT INTO DanhSachDichVu (MaDichVu, TenDichVu, DonGia, DonViTinh, LoaiDichVu) VALUES (?, ?, ?, ?, ?)',
            [MaDichVu, TenDichVu, DonGia, DonViTinh, LoaiDichVu]
        );
        return result.affectedRows;
    },

    update: async (MaDichVu, data) => {
        const { TenDichVu, DonGia, DonViTinh, LoaiDichVu } = data;
        const [result] = await db.query(
            'UPDATE DanhSachDichVu SET TenDichVu = ?, DonGia = ?, DonViTinh = ?, LoaiDichVu = ? WHERE MaDichVu = ?',
            [TenDichVu, DonGia, DonViTinh, LoaiDichVu, MaDichVu]
        );
        return result.affectedRows;
    },

    delete: async (MaDichVu) => {
        const [result] = await db.query('DELETE FROM DanhSachDichVu WHERE MaDichVu = ?', [MaDichVu]);
        return result.affectedRows;
    }
};

module.exports = DanhSachDichVuModel;
