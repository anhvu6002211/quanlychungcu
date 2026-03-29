const express = require('express');
const router = express.Router();
const DanhSachDichVuController = require('../controllers/danhSachDichVuController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', DanhSachDichVuController.getAll);
router.get('/:MaDichVu', DanhSachDichVuController.getByMa);
router.get('/loai/:LoaiDichVu', DanhSachDichVuController.getByLoai);
router.post('/', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), DanhSachDichVuController.create);
router.put('/:MaDichVu', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), DanhSachDichVuController.update);
router.delete('/:MaDichVu', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), DanhSachDichVuController.delete);

module.exports = router;
