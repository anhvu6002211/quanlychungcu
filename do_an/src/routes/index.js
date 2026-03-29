const express = require('express');
const router = express.Router();

const nguoiDungRoutes = require('./nguoiDungRoutes');
const phongRoutes = require('./phongRoutes');
const cuDanRoutes = require('./cuDanRoutes');
const hoaDonRoutes = require('./hoaDonRoutes');
const chiSoDichVuRoutes = require('./chiSoDichVuRoutes');
const suCoRoutes = require('./suCoRoutes');
const toaNhaRoutes = require('./toaNhaRoutes');
const danhSachDichVuRoutes = require('./danhSachDichVuRoutes');
const thongBaoRoutes = require('./thongBaoRoutes');
const baiXeRoutes = require('./baiXeRoutes');

router.use('/nguoidung', nguoiDungRoutes);
router.use('/phong', phongRoutes);
router.use('/cudan', cuDanRoutes);
router.use('/hoadon', hoaDonRoutes);
router.use('/chisodichvu', chiSoDichVuRoutes);
router.use('/suco', suCoRoutes);
router.use('/toanha', toaNhaRoutes);
router.use('/danhsachdichvu', danhSachDichVuRoutes);
router.use('/thongbao', thongBaoRoutes);
router.use('/baixe', baiXeRoutes);

router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API Quản lý Chung cư - QuanLyChungCu_DB',
        version: '2.0.1',
        endpoints: {
            nguoidung: '/api/nguoidung',
            phong: '/api/phong',
            cudan: '/api/cudan',
            hoadon: '/api/hoadon',
            chisodichvu: '/api/chisodichvu',
            suco: '/api/suco',
            toanha: '/api/toanha',
            danhsachdichvu: '/api/danhsachdichvu',
            thongbao: '/api/thongbao',
            baixe: '/api/baixe'
        }
    });
});

module.exports = router;
