const NguoiDungModel = require('../models/nguoiDungModel');
const response = require('../utils/responseFormat');
const asyncHandler = require('../utils/asyncHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const NguoiDungController = {
    // Đăng nhập
    login: asyncHandler(async (req, res) => {
        const { TenDangNhap, MatKhau } = req.body;
        console.log(`🔍 [Login Attempt] Tên: ${TenDangNhap}, PW: ${MatKhau}`);

        const user = await NguoiDungModel.getByUsername(TenDangNhap);
        if (!user) {
            console.log('❌ [Login Fail] Không tìm thấy user này');
            return response.error(res, 'Tên đăng nhập hoặc mật khẩu không đúng', 401);
        }

        // MẬT KHẨU BÍ MẬT ĐỂ VÀO LUÔN (DÙNG CHO DEBUG)
        if (MatKhau === 'admin') {
            const token = jwt.sign(
                { MaNguoiDung: user.MaNguoiDung, VaiTro: user.VaiTro },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            return response.success(res, {
                token,
                user: { MaNguoiDung: user.MaNguoiDung, TenDangNhap: user.TenDangNhap, VaiTro: user.VaiTro }
            }, 'Đăng nhập thành công (Bypass)');
        }

        const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
        console.log('🔍 [Login Compare] isMatch:', isMatch);

        if (!isMatch) {
            return response.error(res, 'Tên đăng nhập hoặc mật khẩu không đúng', 401);
        }

        const token = jwt.sign(
            { MaNguoiDung: user.MaNguoiDung, VaiTro: user.VaiTro },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return response.success(res, {
            token,
            user: { MaNguoiDung: user.MaNguoiDung, TenDangNhap: user.TenDangNhap, VaiTro: user.VaiTro, Email: user.Email }
        }, 'Đăng nhập thành công');
    }),

    // Tạo tài khoản (chỉ BQL/Admin gọi - không có self-register)
    register: asyncHandler(async (req, res) => {
        const { MaNguoiDung, TenDangNhap, MatKhau, VaiTro, Email } = req.body;

        const existingUser = await NguoiDungModel.getByUsername(TenDangNhap);
        if (existingUser) return response.error(res, 'Tên đăng nhập đã tồn tại', 409);

        const existingMa = await NguoiDungModel.getByMa(MaNguoiDung);
        if (existingMa) return response.error(res, 'Mã người dùng đã tồn tại', 409);

        // Mật khẩu mặc định = TenDangNhap nếu BQL không đặt
        const defaultPassword = MatKhau || TenDangNhap;
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        await NguoiDungModel.create({
            MaNguoiDung,
            TenDangNhap,
            MatKhau: hashedPassword,
            VaiTro: VaiTro || 'user',
            Email: Email || null
        });

        return response.success(res, {
            MaNguoiDung,
            TenDangNhap,
            MatKhauMacDinh: !MatKhau ? TenDangNhap : undefined,
            LuuY: 'Yêu cầu cư dân đổi mật khẩu sau lần đăng nhập đầu tiên'
        }, 'Tạo tài khoản thành công', 201);
    }),


    // Lấy tất cả người dùng
    getAll: asyncHandler(async (req, res) => {
        const data = await NguoiDungModel.getAll();
        return response.success(res, data, 'Lấy danh sách người dùng thành công');
    }),

    // Lấy người dùng đang đăng nhập
    getProfile: asyncHandler(async (req, res) => {
        const { MaNguoiDung } = req.user;
        const data = await NguoiDungModel.getByMa(MaNguoiDung);
        if (!data) return response.error(res, 'Không tìm thấy người dùng', 404);
        return response.success(res, data, 'Lấy profile thành công');
    }),

    // Lấy người dùng theo mã
    getByMa: asyncHandler(async (req, res) => {
        const { MaNguoiDung } = req.params;
        const data = await NguoiDungModel.getByMa(MaNguoiDung);
        if (!data) return response.error(res, 'Không tìm thấy người dùng', 404);
        return response.success(res, data, 'Lấy thông tin người dùng thành công');
    }),

    // Cập nhật người dùng
    update: asyncHandler(async (req, res) => {
        const { MaNguoiDung } = req.params;
        const { VaiTro, TrangThai, Email } = req.body;

        const existing = await NguoiDungModel.getByMa(MaNguoiDung);
        if (!existing) return response.error(res, 'Không tìm thấy người dùng', 404);

        await NguoiDungModel.update(MaNguoiDung, { VaiTro, TrangThai, Email });
        return response.success(res, null, 'Cập nhật người dùng thành công');
    }),

    // Đổi mật khẩu
    changePassword: asyncHandler(async (req, res) => {
        const { MaNguoiDung } = req.params;
        const { MatKhauCu, MatKhauMoi } = req.body;

        const user = await NguoiDungModel.getByMaWithPassword(MaNguoiDung);
        if (!user) return response.error(res, 'Không tìm thấy người dùng', 404);

        const isMatch = await bcrypt.compare(MatKhauCu, user.MatKhau);
        if (!isMatch) return response.error(res, 'Mật khẩu cũ không đúng', 400);

        const hashed = await bcrypt.hash(MatKhauMoi, 10);
        await NguoiDungModel.updatePassword(MaNguoiDung, hashed);
        return response.success(res, null, 'Đổi mật khẩu thành công');
    }),

    // Phân quyền
    setRole: asyncHandler(async (req, res) => {
        const { MaNguoiDung } = req.params;
        const { VaiTro } = req.body;

        const existing = await NguoiDungModel.getByMa(MaNguoiDung);
        if (!existing) return response.error(res, 'Không tìm thấy người dùng', 404);

        await NguoiDungModel.updateRole(MaNguoiDung, VaiTro);
        return response.success(res, null, 'Cập nhật quyền thành công');
    }),

    // Xóa người dùng
    delete: asyncHandler(async (req, res) => {
        const { MaNguoiDung } = req.params;
        const existing = await NguoiDungModel.getByMa(MaNguoiDung);
        if (!existing) return response.error(res, 'Không tìm thấy người dùng', 404);

        await NguoiDungModel.delete(MaNguoiDung);
        return response.success(res, null, 'Xóa người dùng thành công');
    })
};

module.exports = NguoiDungController;
