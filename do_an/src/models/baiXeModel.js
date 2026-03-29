const db = require('../config/db.config');

const BaiXeModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT bx.*, cd.HoTen as TenCuDan, cd.MaPhong 
            FROM BaiXe bx 
            LEFT JOIN ThongTinCuDan cd ON bx.MaCuDan = cd.MaCuDan 
            ORDER BY bx.NgayCap DESC
        `);
        return rows;
    },

    getByMa: async (MaTheXe) => {
        const [rows] = await db.query('SELECT * FROM BaiXe WHERE MaTheXe = ?', [MaTheXe]);
        return rows[0];
    },

    getByCuDan: async (MaCuDan) => {
        const [rows] = await db.query('SELECT * FROM BaiXe WHERE MaCuDan = ?', [MaCuDan]);
        return rows;
    },

    create: async (data) => {
        const { MaTheXe, BienSoXe, LoaiXe, MaCuDan, NgayCap, TrangThai } = data;
        const [result] = await db.query(
            'INSERT INTO BaiXe (MaTheXe, BienSoXe, LoaiXe, MaCuDan, NgayCap, TrangThai) VALUES (?, ?, ?, ?, ?, ?)',
            [MaTheXe, BienSoXe, LoaiXe, MaCuDan, NgayCap || new Date(), TrangThai || 'Đang sử dụng']
        );
        return result.affectedRows;
    },

    update: async (MaTheXe, data) => {
        const { BienSoXe, LoaiXe, MaCuDan, TrangThai } = data;
        const [result] = await db.query(
            'UPDATE BaiXe SET BienSoXe = ?, LoaiXe = ?, MaCuDan = ?, TrangThai = ? WHERE MaTheXe = ?',
            [BienSoXe, LoaiXe, MaCuDan, TrangThai, MaTheXe]
        );
        return result.affectedRows;
    },

    delete: async (MaTheXe) => {
        const [result] = await db.query('DELETE FROM BaiXe WHERE MaTheXe = ?', [MaTheXe]);
        return result.affectedRows;
    }
};

module.exports = BaiXeModel;
