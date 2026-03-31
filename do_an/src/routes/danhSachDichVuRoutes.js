const express = require('express');
const router = express.Router();
const DanhSachDichVuController = require('../controllers/danhSachDichVuController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KE_TOAN), DanhSachDichVuController.getAll);
router.get('/:MaDichVu', authMiddleware, DanhSachDichVuController.getByMa);
router.get('/loai/:LoaiDichVu', DanhSachDichVuController.getByLoai);

router.post(
    '/',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KE_TOAN),
    DanhSachDichVuController.create
);

router.put(
    '/:MaDichVu',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KE_TOAN),
    DanhSachDichVuController.update
);

router.delete(
    '/:MaDichVu',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN),
    DanhSachDichVuController.delete
);

module.exports = router;
