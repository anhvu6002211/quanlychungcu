const db = require('../config/db.config');

const HoaDonModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT hd.*, p.SoPhong 
            FROM HoaDon hd 
            LEFT JOIN Phong p ON hd.id_MaPhong = p.MaPhong
            ORDER BY hd.NgayTao DESC
        `);
        return rows;
    },

    getByMa: async (MaHoaDon) => {
        const [rows] = await db.query(`
            SELECT hd.*, p.SoPhong 
            FROM HoaDon hd 
            LEFT JOIN Phong p ON hd.id_MaPhong = p.MaPhong
            WHERE hd.MaHoaDon = ?
        `, [MaHoaDon]);
        return rows[0];
    },

    getByPhong: async (MaPhong) => {
        const [rows] = await db.query(
            'SELECT * FROM HoaDon WHERE id_MaPhong = ? ORDER BY NgayTao DESC',
            [MaPhong]
        );
        return rows;
    },

    getByTrangThai: async (TrangThai) => {
        const [rows] = await db.query('SELECT * FROM HoaDon WHERE TrangThai = ?', [TrangThai]);
        return rows;
    },

    create: async (data) => {
        const { MaHoaDon, id_MaPhong, ThangThu, TongTien, TrangThai, NgayTao, HanDongTien } = data;
        const [result] = await db.query(
            'INSERT INTO HoaDon (MaHoaDon, id_MaPhong, ThangThu, TongTien, TrangThai, NgayTao, HanDongTien) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [MaHoaDon, id_MaPhong, ThangThu, TongTien || 0, TrangThai || 'Chưa thanh toán', NgayTao || new Date(), HanDongTien]
        );
        return result.affectedRows;
    },

    update: async (MaHoaDon, data) => {
        const { TongTien, TrangThai, HanDongTien } = data;
        const [result] = await db.query(
            'UPDATE HoaDon SET TongTien = ?, TrangThai = ?, HanDongTien = ? WHERE MaHoaDon = ?',
            [TongTien, TrangThai, HanDongTien, MaHoaDon]
        );
        return result.affectedRows;
    },

    updateTrangThai: async (MaHoaDon, TrangThai) => {
        const [result] = await db.query(
            'UPDATE HoaDon SET TrangThai = ? WHERE MaHoaDon = ?',
            [TrangThai, MaHoaDon]
        );
        return result.affectedRows;
    },

    pay: async (MaHoaDon, paymentData) => {
        const { MaGiaoDich, PhuongThucThanhToan } = paymentData;
        const [result] = await db.query(
            'UPDATE HoaDon SET TrangThai = "Đã thanh toán", MaGiaoDich = ?, PhuongThucThanhToan = ?, NgayThanhToan = NOW() WHERE MaHoaDon = ?',
            [MaGiaoDich, PhuongThucThanhToan, MaHoaDon]
        );
        return result.affectedRows;
    },


    getStatistics: async () => {
        const [rows] = await db.query(`
            SELECT ThangThu as name, SUM(TongTien) as revenue
            FROM HoaDon
            WHERE TrangThai = 'Đã thanh toán'
            GROUP BY ThangThu
        `);
        return rows;
    },

    delete: async (MaHoaDon) => {
        const [result] = await db.query('DELETE FROM HoaDon WHERE MaHoaDon = ?', [MaHoaDon]);
        return result.affectedRows;
    }
};

module.exports = HoaDonModel;
