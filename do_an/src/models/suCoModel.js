const db = require('../config/db.config');

const SuCoModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT sc.*, p.SoPhong, nd.TenDangNhap AS TenNguoiBao
            FROM SuCo sc
            LEFT JOIN Phong p ON sc.MaPhong = p.MaPhong
            LEFT JOIN NguoiDung nd ON sc.MaNguoiBao = nd.MaNguoiDung
        `);
        return rows;
    },

    getByMa: async (MaSuCo) => {
        const [rows] = await db.query(`
            SELECT sc.*, p.SoPhong, nd.TenDangNhap AS TenNguoiBao
            FROM SuCo sc
            LEFT JOIN Phong p ON sc.MaPhong = p.MaPhong
            LEFT JOIN NguoiDung nd ON sc.MaNguoiBao = nd.MaNguoiDung
            WHERE sc.MaSuCo = ?
        `, [MaSuCo]);
        return rows[0];
    },

    getByTrangThai: async (TrangThai) => {
        const [rows] = await db.query('SELECT * FROM SuCo WHERE TrangThai = ?', [TrangThai]);
        return rows;
    },

    getByNguoiBao: async (MaNguoiBao) => {
        const [rows] = await db.query('SELECT * FROM SuCo WHERE MaNguoiBao = ?', [MaNguoiBao]);
        return rows;
    },

    getByPhong: async (MaPhong) => {
        const [rows] = await db.query('SELECT * FROM SuCo WHERE MaPhong = ?', [MaPhong]);
        return rows;
    },

    create: async (data) => {
        const { MaSuCo, MaNguoiBao, MaPhong, NguoiXuly, TenSuCo, MoTa, AnhSuCo, NgayBaoCao, TrangThai, MucDoUuTien } = data;
        const [result] = await db.query(
            'INSERT INTO SuCo (MaSuCo, MaNguoiBao, MaPhong, NguoiXuly, TenSuCo, MoTa, AnhSuCo, NgayBaoCao, TrangThai, MucDoUuTien) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [MaSuCo, MaNguoiBao, MaPhong, NguoiXuly || null, TenSuCo, MoTa, AnhSuCo, NgayBaoCao || new Date(), TrangThai || 'Chờ duyệt', MucDoUuTien || 'Bình thường']
        );
        return result.affectedRows;
    },

    update: async (MaSuCo, data) => {
        const { TenSuCo, MoTa, AnhSuCo, TrangThai, NguoiXuly, NgayXuLy, GhiChuBQL } = data;
        const [result] = await db.query(
            'UPDATE SuCo SET TenSuCo = ?, MoTa = ?, AnhSuCo = ?, TrangThai = ?, NguoiXuly = ?, NgayXuLy = ?, GhiChuBQL = ? WHERE MaSuCo = ?',
            [TenSuCo, MoTa, AnhSuCo, TrangThai, NguoiXuly, NgayXuLy, GhiChuBQL, MaSuCo]
        );
        return result.affectedRows;
    },


    updateTrangThai: async (MaSuCo, TrangThai, NguoiXuly, NgayXuLy) => {
        const [result] = await db.query(
            'UPDATE SuCo SET TrangThai = ?, NguoiXuly = ?, NgayXuLy = ? WHERE MaSuCo = ?',
            [TrangThai, NguoiXuly, NgayXuLy || (TrangThai === 'Hoàn thành' ? new Date() : null), MaSuCo]
        );
        return result.affectedRows;
    },

    delete: async (MaSuCo) => {
        const [result] = await db.query('DELETE FROM SuCo WHERE MaSuCo = ?', [MaSuCo]);
        return result.affectedRows;
    }
};

module.exports = SuCoModel;
