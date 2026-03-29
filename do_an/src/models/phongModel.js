const db = require('../config/db.config');

const PhongModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT p.*, t.TenToaNha 
            FROM Phong p 
            LEFT JOIN ToaNha t ON p.MaToaNha = t.MaToaNha
        `);
        return rows;
    },

    getByMa: async (MaPhong) => {
        const [rows] = await db.query(`
            SELECT p.*, t.TenToaNha 
            FROM Phong p 
            LEFT JOIN ToaNha t ON p.MaToaNha = t.MaToaNha
            WHERE p.MaPhong = ?
        `, [MaPhong]);
        return rows[0];
    },

    getByToaNha: async (MaToaNha) => {
        const [rows] = await db.query('SELECT * FROM Phong WHERE MaToaNha = ?', [MaToaNha]);
        return rows;
    },

    create: async (data) => {
        const { MaPhong, SoPhong, MaToaNha, TrangThai, DienTich } = data;
        const [result] = await db.query(
            'INSERT INTO Phong (MaPhong, SoPhong, MaToaNha, TrangThai, DienTich) VALUES (?, ?, ?, ?, ?)',
            [MaPhong, SoPhong, MaToaNha, TrangThai || 'Trống', DienTich]
        );
        return result.affectedRows;
    },

    update: async (MaPhong, data) => {
        const { SoPhong, MaToaNha, TrangThai, DienTich } = data;
        const [result] = await db.query(
            'UPDATE Phong SET SoPhong = ?, MaToaNha = ?, TrangThai = ?, DienTich = ? WHERE MaPhong = ?',
            [SoPhong, MaToaNha, TrangThai, DienTich, MaPhong]
        );
        return result.affectedRows;
    },

    delete: async (MaPhong) => {
        const [result] = await db.query('DELETE FROM Phong WHERE MaPhong = ?', [MaPhong]);
        return result.affectedRows;
    }
};

module.exports = PhongModel;
