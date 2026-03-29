const db = require('../config/db.config');

const ThongBaoModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT tb.*, nd.TenDangNhap as TenNguoiDang 
            FROM ThongBao tb 
            LEFT JOIN NguoiDung nd ON tb.NguoiDang = nd.MaNguoiDung 
            ORDER BY tb.NgayDang DESC
        `);
        return rows;
    },

    getByMa: async (MaThongBao) => {
        const [rows] = await db.query('SELECT * FROM ThongBao WHERE MaThongBao = ?', [MaThongBao]);
        return rows[0];
    },

    create: async (data) => {
        const { MaThongBao, TieuDe, NoiDung, LoaiThongBao, NguoiDang } = data;
        const [result] = await db.query(
            'INSERT INTO ThongBao (MaThongBao, TieuDe, NoiDung, LoaiThongBao, NguoiDang) VALUES (?, ?, ?, ?, ?)',
            [MaThongBao, TieuDe, NoiDung, LoaiThongBao, NguoiDang]
        );
        return result.affectedRows;
    },

    update: async (MaThongBao, data) => {
        const { TieuDe, NoiDung, LoaiThongBao } = data;
        const [result] = await db.query(
            'UPDATE ThongBao SET TieuDe = ?, NoiDung = ?, LoaiThongBao = ? WHERE MaThongBao = ?',
            [TieuDe, NoiDung, LoaiThongBao, MaThongBao]
        );
        return result.affectedRows;
    },

    delete: async (MaThongBao) => {
        const [result] = await db.query('DELETE FROM ThongBao WHERE MaThongBao = ?', [MaThongBao]);
        return result.affectedRows;
    }
};

module.exports = ThongBaoModel;
