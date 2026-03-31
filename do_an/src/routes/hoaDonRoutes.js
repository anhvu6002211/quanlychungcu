const express = require('express');
const router = express.Router();
const HoaDonController = require('../controllers/hoaDonController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, HoaDonController.getAll);
router.get('/:MaHoaDon', authMiddleware, HoaDonController.getByMa);
router.get('/phong/:MaPhong', authMiddleware, HoaDonController.getByPhong);
router.get('/trangthai/:TrangThai', authMiddleware, HoaDonController.getByTrangThai);

router.post(
    '/',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KE_TOAN),
    HoaDonController.create
);

router.put(
    '/:MaHoaDon',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KE_TOAN),
    HoaDonController.update
);

router.patch(
    '/:MaHoaDon/trangthai',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KE_TOAN),
    HoaDonController.updateTrangThai
);

router.get(
    '/stats/revenue',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KE_TOAN),
    HoaDonController.getStatistics
);

router.delete(
    '/:MaHoaDon',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KE_TOAN),
    HoaDonController.delete
);

module.exports = router;
