const db = require('../config/db.config');

// Model cho bảng ChiSoDichVu
// Bảng này chứa cả chỉ số đo lường (Loại 1) và số lượng cố định (Loại 2)
// Đồng thời đóng vai trò là chi tiết hóa đơn thông qua id_MaHoaDon
const ChiSoDichVuModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT cs.*, dv.TenDichVu, dv.DonGia, dv.LoaiDichVu, dv.DonViTinh
            FROM ChiSoDichVu cs 
            LEFT JOIN DanhSachDichVu dv ON cs.id_MaDichVu = dv.MaDichVu
        `);
        return rows;
    },

    getByMa: async (MaGhi) => {
        const [rows] = await db.query(`
            SELECT cs.*, dv.TenDichVu, dv.DonGia, dv.LoaiDichVu, dv.DonViTinh
            FROM ChiSoDichVu cs
            LEFT JOIN DanhSachDichVu dv ON cs.id_MaDichVu = dv.MaDichVu
            WHERE cs.MaGhi = ?
        `, [MaGhi]);
        return rows[0];
    },

    // Lấy tất cả chỉ số thuộc 1 hóa đơn (xem chi tiết hóa đơn)
    getByHoaDon: async (MaHoaDon) => {
        const [rows] = await db.query(`
            SELECT cs.*, dv.TenDichVu, dv.DonGia, dv.LoaiDichVu, dv.DonViTinh
            FROM ChiSoDichVu cs
            LEFT JOIN DanhSachDichVu dv ON cs.id_MaDichVu = dv.MaDichVu
            WHERE cs.id_MaHoaDon = ?
        `, [MaHoaDon]);
        return rows;
    },

    create: async (data) => {
        const { MaGhi, id_MaDichVu, id_MaHoaDon, ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi } = data;
        const [result] = await db.query(
            'INSERT INTO ChiSoDichVu (MaGhi, id_MaDichVu, id_MaHoaDon, ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [MaGhi, id_MaDichVu, id_MaHoaDon, ChiSoLanGhiTruoc ?? null, ChiSoHienTai ?? null, SoLuong ?? null, NgayGhi]
        );
        return result.affectedRows;
    },

    update: async (MaGhi, data) => {
        const { ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi } = data;
        const [result] = await db.query(
            'UPDATE ChiSoDichVu SET ChiSoLanGhiTruoc = ?, ChiSoHienTai = ?, SoLuong = ?, NgayGhi = ? WHERE MaGhi = ?',
            [ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi, MaGhi]
        );
        return result.affectedRows;
    },

    delete: async (MaGhi) => {
        const [result] = await db.query('DELETE FROM ChiSoDichVu WHERE MaGhi = ?', [MaGhi]);
        return result.affectedRows;
    }
};

module.exports = ChiSoDichVuModel;
