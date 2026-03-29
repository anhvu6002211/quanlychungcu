const express = require('express');
const router = express.Router();
const BaiXeController = require('../controllers/baiXeController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// ✅ Ai đăng nhập cũng xem được bãi xe (để cư dân thấy xe của mình)
router.get('/', authMiddleware, BaiXeController.getAll);
router.get('/:MaTheXe', authMiddleware, BaiXeController.getByMa);
router.get('/cudan/:MaCuDan', authMiddleware, BaiXeController.getByCuDan);

// 🔒 Chỉ Ban Quản Lý hoặc Admin mới được quản lý bãi xe
router.post(
    '/',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    BaiXeController.create
);

router.put(
    '/:MaTheXe',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    BaiXeController.update
);

router.delete(
    '/:MaTheXe',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    BaiXeController.delete
);

module.exports = router;
