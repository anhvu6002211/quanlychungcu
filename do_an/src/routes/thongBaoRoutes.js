const express = require('express');
const router = express.Router();
const ThongBaoController = require('../controllers/thongBaoController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// ✅ Ai cũng xem được thông báo (Tất cả Cư dân/BQL/Admin)
router.get('/', authMiddleware, ThongBaoController.getAll);
router.get('/:MaThongBao', authMiddleware, ThongBaoController.getByMa);

// 🔒 Chỉ Ban Quản Lý hoặc Admin mới được đăng/sửa/xóa thông báo
router.post(
    '/',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    ThongBaoController.create
);

router.put(
    '/:MaThongBao',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    ThongBaoController.update
);

router.delete(
    '/:MaThongBao',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    ThongBaoController.delete
);

module.exports = router;
