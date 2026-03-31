const express = require('express');
const router = express.Router();
const ThongTinCuDanController = require('../controllers/cuDanController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KE_TOAN), ThongTinCuDanController.getAll);
router.get('/:MaCuDan', authMiddleware, ThongTinCuDanController.getByMa);
router.get('/phong/:MaPhong', authMiddleware, ThongTinCuDanController.getByPhong);
router.get('/nguoidung/:MaNguoiDung', authMiddleware, ThongTinCuDanController.getByNguoiDung);
router.post('/', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KE_TOAN), ThongTinCuDanController.create);
router.put('/:MaCuDan', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KE_TOAN), ThongTinCuDanController.update);
router.delete('/:MaCuDan', authMiddleware, roleMiddleware(roleMiddleware.ROLES.ADMIN), ThongTinCuDanController.delete);

module.exports = router;
