const db = require('../config/db.config');

const ThongTinCuDanModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT cd.*, p.SoPhong, nd.TenDangNhap
            FROM ThongTinCuDan cd 
            LEFT JOIN Phong p ON cd.MaPhong = p.MaPhong
            LEFT JOIN NguoiDung nd ON cd.MaNguoiDung = nd.MaNguoiDung
        `);
        return rows;
    },

    getByMa: async (MaCuDan) => {
        const [rows] = await db.query(`
            SELECT cd.*, p.SoPhong, nd.TenDangNhap
            FROM ThongTinCuDan cd 
            LEFT JOIN Phong p ON cd.MaPhong = p.MaPhong
            LEFT JOIN NguoiDung nd ON cd.MaNguoiDung = nd.MaNguoiDung
            WHERE cd.MaCuDan = ?
        `, [MaCuDan]);
        return rows[0];
    },

    getByPhong: async (MaPhong) => {
        const [rows] = await db.query('SELECT * FROM ThongTinCuDan WHERE MaPhong = ?', [MaPhong]);
        return rows;
    },

    getByNguoiDung: async (MaNguoiDung) => {
        const [rows] = await db.query('SELECT * FROM ThongTinCuDan WHERE MaNguoiDung = ?', [MaNguoiDung]);
        return rows[0];
    },

    create: async (data) => {
        const { MaCuDan, HoTen, SoDienThoai, CCCD, QueQuan, MaPhong, MaNguoiDung } = data;
        const [result] = await db.query(
            'INSERT INTO ThongTinCuDan (MaCuDan, HoTen, SoDienThoai, CCCD, QueQuan, MaPhong, MaNguoiDung) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [MaCuDan, HoTen, SoDienThoai, CCCD, QueQuan, MaPhong, MaNguoiDung]
        );
        return result.affectedRows;
    },

    update: async (MaCuDan, data) => {
        const { HoTen, SoDienThoai, CCCD, QueQuan, MaPhong, MaNguoiDung } = data;
        const [result] = await db.query(
            'UPDATE ThongTinCuDan SET HoTen = ?, SoDienThoai = ?, CCCD = ?, QueQuan = ?, MaPhong = ?, MaNguoiDung = ? WHERE MaCuDan = ?',
            [HoTen, SoDienThoai, CCCD, QueQuan, MaPhong, MaNguoiDung, MaCuDan]
        );
        return result.affectedRows;
    },

    delete: async (MaCuDan) => {
        const [result] = await db.query('DELETE FROM ThongTinCuDan WHERE MaCuDan = ?', [MaCuDan]);
        return result.affectedRows;
    }
};

module.exports = ThongTinCuDanModel;
