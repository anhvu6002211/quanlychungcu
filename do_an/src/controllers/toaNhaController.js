const ToaNhaModel = require('../models/toaNhaModel');
const response = require('../utils/responseFormat');
const asyncHandler = require('../utils/asyncHandler');

const ToaNhaController = {
    getAll: asyncHandler(async (req, res) => {
        const data = await ToaNhaModel.getAll();
        return response.success(res, data, 'Lấy danh sách tòa nhà thành công');
    }),

    getByMa: asyncHandler(async (req, res) => {
        const { MaToaNha } = req.params;
        const data = await ToaNhaModel.getByMa(MaToaNha);
        if (!data) return response.error(res, 'Không tìm thấy tòa nhà', 404);
        return response.success(res, data, 'Lấy thông tin tòa nhà thành công');
    }),

    create: asyncHandler(async (req, res) => {
        const { MaToaNha, TenToaNha, SoLuongPhong } = req.body;

        const existing = await ToaNhaModel.getByMa(MaToaNha);
        if (existing) return response.error(res, 'Mã tòa nhà đã tồn tại', 409);

        await ToaNhaModel.create({ MaToaNha, TenToaNha, SoLuongPhong });
        return response.success(res, { MaToaNha }, 'Tạo tòa nhà thành công', 201);
    }),

    update: asyncHandler(async (req, res) => {
        const { MaToaNha } = req.params;
        const { TenToaNha, SoLuongPhong } = req.body;

        const existing = await ToaNhaModel.getByMa(MaToaNha);
        if (!existing) return response.error(res, 'Không tìm thấy tòa nhà', 404);

        await ToaNhaModel.update(MaToaNha, { TenToaNha, SoLuongPhong });
        return response.success(res, null, 'Cập nhật tòa nhà thành công');
    }),

    delete: asyncHandler(async (req, res) => {
        const { MaToaNha } = req.params;
        const existing = await ToaNhaModel.getByMa(MaToaNha);
        if (!existing) return response.error(res, 'Không tìm thấy tòa nhà', 404);

        await ToaNhaModel.delete(MaToaNha);
        return response.success(res, null, 'Xóa tòa nhà thành công');
    })
};

module.exports = ToaNhaController;
