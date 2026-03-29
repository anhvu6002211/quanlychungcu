const db = require('../config/db.config');

const NguoiDungModel = {
    getAll: async () => {
        const [rows] = await db.query(
            'SELECT MaNguoiDung, TenDangNhap, VaiTro, TrangThai, Email FROM NguoiDung'
        );
        return rows;
    },

    getByMa: async (MaNguoiDung) => {
        const [rows] = await db.query(
            'SELECT MaNguoiDung, TenDangNhap, VaiTro, TrangThai, Email FROM NguoiDung WHERE MaNguoiDung = ?',
            [MaNguoiDung]
        );
        return rows[0];
    },

    // Dùng cho đăng nhập (có mật khẩu)
    getByUsername: async (TenDangNhap) => {
        const [rows] = await db.query('SELECT * FROM NguoiDung WHERE TenDangNhap = ?', [TenDangNhap]);
        return rows[0];
    },

    // Lấy kèm mật khẩu (dùng cho đổi mật khẩu)
    getByMaWithPassword: async (MaNguoiDung) => {
        const [rows] = await db.query('SELECT * FROM NguoiDung WHERE MaNguoiDung = ?', [MaNguoiDung]);
        return rows[0];
    },

    create: async (data) => {
        const { MaNguoiDung, TenDangNhap, MatKhau, VaiTro, TrangThai, Email } = data;
        const [result] = await db.query(
            'INSERT INTO NguoiDung (MaNguoiDung, TenDangNhap, MatKhau, VaiTro, TrangThai, Email) VALUES (?, ?, ?, ?, ?, ?)',
            [MaNguoiDung, TenDangNhap, MatKhau, VaiTro || 'user', TrangThai || 'Hoạt động', Email || null]
        );
        return result.affectedRows;
    },

    update: async (MaNguoiDung, data) => {
        const { VaiTro, TrangThai, Email } = data;
        const [result] = await db.query(
            'UPDATE NguoiDung SET VaiTro = ?, TrangThai = ?, Email = ? WHERE MaNguoiDung = ?',
            [VaiTro, TrangThai, Email, MaNguoiDung]
        );
        return result.affectedRows;
    },

    updatePassword: async (MaNguoiDung, MatKhau) => {
        const [result] = await db.query(
            'UPDATE NguoiDung SET MatKhau = ? WHERE MaNguoiDung = ?',
            [MatKhau, MaNguoiDung]
        );
        return result.affectedRows;
    },

    updateRole: async (MaNguoiDung, VaiTro) => {
        const [result] = await db.query(
            'UPDATE NguoiDung SET VaiTro = ? WHERE MaNguoiDung = ?',
            [VaiTro, MaNguoiDung]
        );
        return result.affectedRows;
    },

    delete: async (MaNguoiDung) => {
        const [result] = await db.query('DELETE FROM NguoiDung WHERE MaNguoiDung = ?', [MaNguoiDung]);
        return result.affectedRows;
    }
};

module.exports = NguoiDungModel;
