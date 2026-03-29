const ThongTinCuDanModel = require('../models/cuDanModel');
const response = require('../utils/responseFormat');
const asyncHandler = require('../utils/asyncHandler');

const ThongTinCuDanController = {
    getAll: asyncHandler(async (req, res) => {
        const data = await ThongTinCuDanModel.getAll();
        return response.success(res, data, 'Lấy danh sách cư dân thành công');
    }),

    getByMa: asyncHandler(async (req, res) => {
        const { MaCuDan } = req.params;
        const data = await ThongTinCuDanModel.getByMa(MaCuDan);
        if (!data) return response.error(res, 'Không tìm thấy cư dân', 404);
        return response.success(res, data, 'Lấy thông tin cư dân thành công');
    }),

    getByPhong: asyncHandler(async (req, res) => {
        const { MaPhong } = req.params;
        const data = await ThongTinCuDanModel.getByPhong(MaPhong);
        return response.success(res, data, 'Lấy danh sách cư dân theo phòng thành công');
    }),

    getByNguoiDung: asyncHandler(async (req, res) => {
        const { MaNguoiDung } = req.params;
        const data = await ThongTinCuDanModel.getByNguoiDung(MaNguoiDung);
        if (!data) return response.error(res, 'Không tìm thấy thông tin cư dân', 404);
        return response.success(res, data, 'Lấy thông tin cư dân theo người dùng thành công');
    }),

    create: asyncHandler(async (req, res) => {
        const { MaCuDan, HoTen, SoDienThoai, CCCD, QueQuan, MaPhong, MaNguoiDung } = req.body;
        if (!MaCuDan || !HoTen) return response.error(res, 'MaCuDan và HoTen là bắt buộc', 400);

        const existing = await ThongTinCuDanModel.getByMa(MaCuDan);
        if (existing) return response.error(res, 'Mã cư dân đã tồn tại', 409);

        await ThongTinCuDanModel.create({ MaCuDan, HoTen, SoDienThoai, CCCD, QueQuan, MaPhong, MaNguoiDung });
        return response.success(res, { MaCuDan }, 'Tạo hồ sơ cư dân thành công', 201);
    }),

    update: asyncHandler(async (req, res) => {
        const { MaCuDan } = req.params;
        const { HoTen, SoDienThoai, CCCD, QueQuan, MaPhong, MaNguoiDung } = req.body;

        const existing = await ThongTinCuDanModel.getByMa(MaCuDan);
        if (!existing) return response.error(res, 'Không tìm thấy cư dân', 404);

        await ThongTinCuDanModel.update(MaCuDan, { HoTen, SoDienThoai, CCCD, QueQuan, MaPhong, MaNguoiDung });
        return response.success(res, null, 'Cập nhật hồ sơ cư dân thành công');
    }),

    delete: asyncHandler(async (req, res) => {
        const { MaCuDan } = req.params;
        const existing = await ThongTinCuDanModel.getByMa(MaCuDan);
        if (!existing) return response.error(res, 'Không tìm thấy cư dân', 404);

        await ThongTinCuDanModel.delete(MaCuDan);
        return response.success(res, null, 'Xóa hồ sơ cư dân thành công');
    })
};

module.exports = ThongTinCuDanController;
