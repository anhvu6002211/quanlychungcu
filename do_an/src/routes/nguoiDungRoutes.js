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

// ✅ Đăng nhập - Public (ai cũng vào được)
router.post('/login', validate(loginSchema), NguoiDungController.login);

// 🔒 Tạo tài khoản - CHỈ Admin hoặc Ban Quản Lý mới được tạo TK cho cư dân
// (Không có đăng ký tự do - cư dân không tự tạo được tài khoản)
router.post(
    '/taotaikhoan',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    validate(createUserSchema),
    NguoiDungController.register
);

// 🔒 Lấy tất cả người dùng - Chỉ BQL, Admin
router.get(
    '/',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    NguoiDungController.getAll
);

// ✅ Lấy profile của chính mình
router.get('/me/profile', authMiddleware, NguoiDungController.getProfile);

// 🔒 Lấy người dùng theo mã
router.get('/:MaNguoiDung', authMiddleware, NguoiDungController.getByMa);

// 🔒 Cập nhật thông tin
router.put('/:MaNguoiDung', authMiddleware, NguoiDungController.update);

// 🔒 Xóa tài khoản - Chỉ Admin
router.delete(
    '/:MaNguoiDung',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN),
    NguoiDungController.delete
);

// ✅ Đổi mật khẩu (tự đổi của mình)
router.put('/:MaNguoiDung/password', authMiddleware, NguoiDungController.changePassword);

// 🔒 Phân quyền - Chỉ Admin
router.patch(
    '/:MaNguoiDung/role',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN),
    NguoiDungController.setRole
);

module.exports = router;
