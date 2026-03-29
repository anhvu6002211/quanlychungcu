const express = require('express');
const router = express.Router();
const ThongTinCuDanController = require('../controllers/cuDanController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, ThongTinCuDanController.getAll);
router.get('/:MaCuDan', authMiddleware, ThongTinCuDanController.getByMa);
router.get('/phong/:MaPhong', authMiddleware, ThongTinCuDanController.getByPhong);
router.get('/nguoidung/:MaNguoiDung', authMiddleware, ThongTinCuDanController.getByNguoiDung);
router.post('/', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), ThongTinCuDanController.create);
router.put('/:MaCuDan', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), ThongTinCuDanController.update);
router.delete('/:MaCuDan', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), ThongTinCuDanController.delete);

module.exports = router;
