const ThongBaoModel = require('../models/thongBaoModel');
const response = require('../utils/responseFormat');
const asyncHandler = require('../utils/asyncHandler');

const ThongBaoController = {
    getAll: asyncHandler(async (req, res) => {
        const data = await ThongBaoModel.getAll();
        return response.success(res, data, 'Lấy danh sách thông báo thành công');
    }),

    getByMa: asyncHandler(async (req, res) => {
        const { MaThongBao } = req.params;
        const data = await ThongBaoModel.getByMa(MaThongBao);
        if (!data) return response.error(res, 'Không tìm thấy thông báo', 404);
        return response.success(res, data, 'Lấy thông tin thông báo thành công');
    }),

    create: asyncHandler(async (req, res) => {
        const { MaThongBao, TieuDe, NoiDung, LoaiThongBao } = req.body;
        const { MaNguoiDung } = req.user; // Từ authMiddleware

        if (!MaThongBao || !TieuDe) return response.error(res, 'MaThongBao và TieuDe là bắt buộc', 400);

        const existing = await ThongBaoModel.getByMa(MaThongBao);
        if (existing) return response.error(res, 'Mã thông báo đã tồn tại', 409);

        await ThongBaoModel.create({ MaThongBao, TieuDe, NoiDung, LoaiThongBao, NguoiDang: MaNguoiDung });

        // Phát tín hiệu Real-time
        req.io.emit('NEW_NOTIFICATION', { MaThongBao, TieuDe, LoaiThongBao });

        return response.success(res, { MaThongBao }, 'Tạo thông báo thành công', 201);

    }),

    update: asyncHandler(async (req, res) => {
        const { MaThongBao } = req.params;
        const { TieuDe, NoiDung, LoaiThongBao } = req.body;

        const existing = await ThongBaoModel.getByMa(MaThongBao);
        if (!existing) return response.error(res, 'Không tìm thấy thông báo', 404);

        await ThongBaoModel.update(MaThongBao, { TieuDe, NoiDung, LoaiThongBao });
        return response.success(res, null, 'Cập nhật thông báo thành công');
    }),

    delete: asyncHandler(async (req, res) => {
        const { MaThongBao } = req.params;
        const existing = await ThongBaoModel.getByMa(MaThongBao);
        if (!existing) return response.error(res, 'Không tìm thấy thông báo', 404);

        await ThongBaoModel.delete(MaThongBao);
        return response.success(res, null, 'Xóa thông báo thành công');
    })
};

module.exports = ThongBaoController;
