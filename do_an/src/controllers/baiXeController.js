const BaiXeModel = require('../models/baiXeModel');
const response = require('../utils/responseFormat');
const asyncHandler = require('../utils/asyncHandler');

const BaiXeController = {
    getAll: asyncHandler(async (req, res) => {
        const data = await BaiXeModel.getAll();
        return response.success(res, data, 'Lấy danh sách bãi xe thành công');
    }),

    getByMa: asyncHandler(async (req, res) => {
        const { MaTheXe } = req.params;
        const data = await BaiXeModel.getByMa(MaTheXe);
        if (!data) return response.error(res, 'Không tìm thấy thẻ xe', 404);
        return response.success(res, data, 'Lấy thông tin thẻ xe thành công');
    }),

    getByCuDan: asyncHandler(async (req, res) => {
        const { MaCuDan } = req.params;
        const data = await BaiXeModel.getByCuDan(MaCuDan);
        return response.success(res, data, 'Lấy danh sách thẻ xe cư dân thành công');
    }),

    create: asyncHandler(async (req, res) => {
        const { MaTheXe, BienSoXe, LoaiXe, MaCuDan, NgayCap, TrangThai } = req.body;
        if (!MaTheXe || !BienSoXe || !LoaiXe) return response.error(res, 'Mã thẻ, biển số và loại xe là bắt buộc', 400);

        const existing = await BaiXeModel.getByMa(MaTheXe);
        if (existing) return response.error(res, 'Mã thẻ xe đã tồn tại', 409);

        await BaiXeModel.create({ MaTheXe, BienSoXe, LoaiXe, MaCuDan, NgayCap, TrangThai });
        return response.success(res, { MaTheXe }, 'Đăng ký thẻ xe thành công', 201);
    }),

    update: asyncHandler(async (req, res) => {
        const { MaTheXe } = req.params;
        const { BienSoXe, LoaiXe, MaCuDan, TrangThai } = req.body;

        const existing = await BaiXeModel.getByMa(MaTheXe);
        if (!existing) return response.error(res, 'Không tìm thấy thẻ xe', 404);

        await BaiXeModel.update(MaTheXe, { BienSoXe, LoaiXe, MaCuDan, TrangThai });
        return response.success(res, null, 'Cập nhật thẻ xe thành công');
    }),

    delete: asyncHandler(async (req, res) => {
        const { MaTheXe } = req.params;
        const existing = await BaiXeModel.getByMa(MaTheXe);
        if (!existing) return response.error(res, 'Không tìm thấy thẻ xe', 404);

        await BaiXeModel.delete(MaTheXe);
        return response.success(res, null, 'Xóa thẻ xe thành công');
    })
};

module.exports = BaiXeController;
