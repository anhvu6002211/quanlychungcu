const express = require('express');
const router = express.Router();
const HoaDonController = require('../controllers/hoaDonController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, HoaDonController.getAll);
router.get('/:MaHoaDon', authMiddleware, HoaDonController.getByMa);
router.get('/phong/:MaPhong', authMiddleware, HoaDonController.getByPhong);
router.get('/trangthai/:TrangThai', authMiddleware, HoaDonController.getByTrangThai);
router.post('/', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), HoaDonController.create);
router.put('/:MaHoaDon', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), HoaDonController.update);
router.patch('/:MaHoaDon/trangthai', authMiddleware, HoaDonController.updateTrangThai);
router.post('/:MaHoaDon/pay', authMiddleware, HoaDonController.pay);
router.get('/stats/revenue', authMiddleware, HoaDonController.getStatistics);

router.delete('/:MaHoaDon', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), HoaDonController.delete);

module.exports = router;
