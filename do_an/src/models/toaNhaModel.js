const db = require('../config/db.config');

const ToaNhaModel = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM ToaNha');
        return rows;
    },

    getByMa: async (MaToaNha) => {
        const [rows] = await db.query('SELECT * FROM ToaNha WHERE MaToaNha = ?', [MaToaNha]);
        return rows[0];
    },

    create: async (data) => {
        const { MaToaNha, TenToaNha, SoLuongPhong } = data;
        const [result] = await db.query(
            'INSERT INTO ToaNha (MaToaNha, TenToaNha, SoLuongPhong) VALUES (?, ?, ?)',
            [MaToaNha, TenToaNha, SoLuongPhong || 0]
        );
        return result.affectedRows;
    },

    update: async (MaToaNha, data) => {
        const { TenToaNha, SoLuongPhong } = data;
        const [result] = await db.query(
            'UPDATE ToaNha SET TenToaNha = ?, SoLuongPhong = ? WHERE MaToaNha = ?',
            [TenToaNha, SoLuongPhong, MaToaNha]
        );
        return result.affectedRows;
    },

    delete: async (MaToaNha) => {
        const [result] = await db.query('DELETE FROM ToaNha WHERE MaToaNha = ?', [MaToaNha]);
        return result.affectedRows;
    }
};

module.exports = ToaNhaModel;
