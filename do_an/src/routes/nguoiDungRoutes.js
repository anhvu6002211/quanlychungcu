const express = require('express');
const router = express.Router();
const NguoiDungController = require('../controllers/nguoiDungController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validate = require('../utils/validate');

const loginSchema = {
    TenDangNhap: { required: true },
    MatKhau: { required: true }
};

// Schema tạo tài khoản cho cư dân (BQL tạo)
const createUserSchema = {
    MaNguoiDung: { required: true },
    TenDangNhap: { required: true, minLength: 3 },
    MatKhau: { required: true, minLength: 6 }
};

// ✅ Đăng nhập - Public
router.post('/login', validate(loginSchema), NguoiDungController.login);

// 🔒 Quản lý tài khoản (Chỉ ADMIN, BAN_QUAN_LY)
router.post(
    '/taotaikhoan',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    validate(createUserSchema),
    NguoiDungController.register
);

router.get(
    '/',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    NguoiDungController.getAll
);

// ✅ Profile cá nhân
router.get('/me/profile', authMiddleware, NguoiDungController.getProfile);

// 🔒 Xem/Sửa/Xóa tài khoản cụ thể
router.get(
    '/:MaNguoiDung',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    NguoiDungController.getByMa
);

router.put(
    '/:MaNguoiDung',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    NguoiDungController.update
);

router.delete(
    '/:MaNguoiDung',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN),
    NguoiDungController.delete
);

router.put('/:MaNguoiDung/password', authMiddleware, NguoiDungController.changePassword);

router.patch(
    '/:MaNguoiDung/role',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN),
    NguoiDungController.setRole
);

module.exports = router;
