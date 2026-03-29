const HoaDonModel = require('../models/hoaDonModel');
const response = require('../utils/responseFormat');
const asyncHandler = require('../utils/asyncHandler');

const HoaDonController = {
    getAll: asyncHandler(async (req, res) => {
        const data = await HoaDonModel.getAll();
        return response.success(res, data, 'Lấy danh sách hóa đơn thành công');
    }),

    getByMa: asyncHandler(async (req, res) => {
        const { MaHoaDon } = req.params;
        const data = await HoaDonModel.getByMa(MaHoaDon);
        if (!data) return response.error(res, 'Không tìm thấy hóa đơn', 404);
        return response.success(res, data, 'Lấy thông tin hóa đơn thành công');
    }),

    getByPhong: asyncHandler(async (req, res) => {
        const { MaPhong } = req.params;
        const data = await HoaDonModel.getByPhong(MaPhong);
        return response.success(res, data, 'Lấy danh sách hóa đơn theo phòng thành công');
    }),

    getByTrangThai: asyncHandler(async (req, res) => {
        const { TrangThai } = req.params;
        const data = await HoaDonModel.getByTrangThai(TrangThai);
        return response.success(res, data, 'Lấy danh sách hóa đơn theo trạng thái thành công');
    }),

    create: asyncHandler(async (req, res) => {
        const { MaHoaDon, id_MaPhong, ThangThu, TongTien, TrangThai, NgayTao, HanDongTien } = req.body;
        if (!MaHoaDon || !id_MaPhong || !ThangThu) return response.error(res, 'MaHoaDon, id_MaPhong và ThangThu là bắt buộc', 400);

        const existing = await HoaDonModel.getByMa(MaHoaDon);
        if (existing) return response.error(res, 'Mã hóa đơn đã tồn tại', 409);

        await HoaDonModel.create({ MaHoaDon, id_MaPhong, ThangThu, TongTien, TrangThai, NgayTao, HanDongTien });
        return response.success(res, { MaHoaDon }, 'Tạo hóa đơn thành công', 201);
    }),

    update: asyncHandler(async (req, res) => {
        const { MaHoaDon } = req.params;
        const { TongTien, TrangThai, HanDongTien } = req.body;

        const existing = await HoaDonModel.getByMa(MaHoaDon);
        if (!existing) return response.error(res, 'Không tìm thấy hóa đơn', 404);

        await HoaDonModel.update(MaHoaDon, { TongTien, TrangThai, HanDongTien });
        return response.success(res, null, 'Cập nhật hóa đơn thành công');
    }),

    // Cập nhật trạng thái thanh toán nhanh
    updateTrangThai: asyncHandler(async (req, res) => {
        const { MaHoaDon } = req.params;
        const { TrangThai } = req.body;
        if (!TrangThai) return response.error(res, 'TrangThai là bắt buộc', 400);

        const existing = await HoaDonModel.getByMa(MaHoaDon);
        if (!existing) return response.error(res, 'Không tìm thấy hóa đơn', 404);

        await HoaDonModel.updateTrangThai(MaHoaDon, TrangThai);
        return response.success(res, null, 'Cập nhật trạng thái hóa đơn thành công');
    }),

    getStatistics: asyncHandler(async (req, res) => {
        const data = await HoaDonModel.getStatistics();
        return response.success(res, data, 'Lấy báo cáo doanh thu thành công');
    }),

    delete: asyncHandler(async (req, res) => {
        const { MaHoaDon } = req.params;
        const existing = await HoaDonModel.getByMa(MaHoaDon);
        if (!existing) return response.error(res, 'Không tìm thấy hóa đơn', 404);

        await HoaDonModel.delete(MaHoaDon);
        return response.success(res, null, 'Xóa hóa đơn thành công');
    })
};

module.exports = HoaDonController;
