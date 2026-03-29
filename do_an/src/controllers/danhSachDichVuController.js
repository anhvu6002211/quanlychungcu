const DanhSachDichVuModel = require('../models/danhSachDichVuModel');
const response = require('../utils/responseFormat');
const asyncHandler = require('../utils/asyncHandler');

const DanhSachDichVuController = {
    getAll: asyncHandler(async (req, res) => {
        const data = await DanhSachDichVuModel.getAll();
        return response.success(res, data, 'Lấy danh sách dịch vụ thành công');
    }),

    getByMa: asyncHandler(async (req, res) => {
        const { MaDichVu } = req.params;
        const data = await DanhSachDichVuModel.getByMa(MaDichVu);
        if (!data) return response.error(res, 'Không tìm thấy dịch vụ', 404);
        return response.success(res, data, 'Lấy thông tin dịch vụ thành công');
    }),

    getByLoai: asyncHandler(async (req, res) => {
        const { LoaiDichVu } = req.params;
        const data = await DanhSachDichVuModel.getByLoai(LoaiDichVu);
        return response.success(res, data, 'Lấy danh sách dịch vụ theo loại thành công');
    }),

    create: asyncHandler(async (req, res) => {
        const { MaDichVu, TenDichVu, DonGia, DonViTinh, LoaiDichVu } = req.body;
        if (!MaDichVu || !TenDichVu || !DonGia) return response.error(res, 'MaDichVu, TenDichVu và DonGia là bắt buộc', 400);

        const existing = await DanhSachDichVuModel.getByMa(MaDichVu);
        if (existing) return response.error(res, 'Mã dịch vụ đã tồn tại', 409);

        await DanhSachDichVuModel.create({ MaDichVu, TenDichVu, DonGia, DonViTinh, LoaiDichVu });
        return response.success(res, { MaDichVu }, 'Tạo dịch vụ thành công', 201);
    }),

    update: asyncHandler(async (req, res) => {
        const { MaDichVu } = req.params;
        const { TenDichVu, DonGia, DonViTinh, LoaiDichVu } = req.body;

        const existing = await DanhSachDichVuModel.getByMa(MaDichVu);
        if (!existing) return response.error(res, 'Không tìm thấy dịch vụ', 404);

        await DanhSachDichVuModel.update(MaDichVu, { TenDichVu, DonGia, DonViTinh, LoaiDichVu });
        return response.success(res, null, 'Cập nhật dịch vụ thành công');
    }),

    delete: asyncHandler(async (req, res) => {
        const { MaDichVu } = req.params;
        const existing = await DanhSachDichVuModel.getByMa(MaDichVu);
        if (!existing) return response.error(res, 'Không tìm thấy dịch vụ', 404);

        await DanhSachDichVuModel.delete(MaDichVu);
        return response.success(res, null, 'Xóa dịch vụ thành công');
    })
};

module.exports = DanhSachDichVuController;
