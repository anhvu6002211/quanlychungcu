const PhongModel = require('../models/phongModel');
const response = require('../utils/responseFormat');
const asyncHandler = require('../utils/asyncHandler');

const PhongController = {
    getAll: asyncHandler(async (req, res) => {
        const data = await PhongModel.getAll();
        return response.success(res, data, 'Lấy danh sách phòng thành công');
    }),

    getByMa: asyncHandler(async (req, res) => {
        const { MaPhong } = req.params;
        const data = await PhongModel.getByMa(MaPhong);
        if (!data) return response.error(res, 'Không tìm thấy phòng', 404);
        return response.success(res, data, 'Lấy thông tin phòng thành công');
    }),

    getByToaNha: asyncHandler(async (req, res) => {
        const { MaToaNha } = req.params;
        const data = await PhongModel.getByToaNha(MaToaNha);
        return response.success(res, data, 'Lấy danh sách phòng theo tòa nhà thành công');
    }),

    create: asyncHandler(async (req, res) => {
        const { MaPhong, SoPhong, MaToaNha, TrangThai, DienTich } = req.body;
        if (!MaPhong || !SoPhong) return response.error(res, 'MaPhong và SoPhong là bắt buộc', 400);

        const existing = await PhongModel.getByMa(MaPhong);
        if (existing) return response.error(res, 'Mã phòng đã tồn tại', 409);

        await PhongModel.create({ MaPhong, SoPhong, MaToaNha, TrangThai, DienTich });
        return response.success(res, { MaPhong }, 'Tạo phòng thành công', 201);
    }),

    update: asyncHandler(async (req, res) => {
        const { MaPhong } = req.params;
        const { SoPhong, MaToaNha, TrangThai, DienTich } = req.body;

        const existing = await PhongModel.getByMa(MaPhong);
        if (!existing) return response.error(res, 'Không tìm thấy phòng', 404);

        await PhongModel.update(MaPhong, { SoPhong, MaToaNha, TrangThai, DienTich });
        return response.success(res, null, 'Cập nhật phòng thành công');
    }),

    delete: asyncHandler(async (req, res) => {
        const { MaPhong } = req.params;
        const existing = await PhongModel.getByMa(MaPhong);
        if (!existing) return response.error(res, 'Không tìm thấy phòng', 404);

        await PhongModel.delete(MaPhong);
        return response.success(res, null, 'Xóa phòng thành công');
    })
};

module.exports = PhongController;
