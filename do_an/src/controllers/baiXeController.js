const BaiXeModel = require('../models/baiXeModel');
const HoaDonModel = require('../models/hoaDonModel');
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

    calculateFee: asyncHandler(async (req, res) => {
        const { MaPhong } = req.params;
        const totalFee = await BaiXeModel.calculateTotalByPhong(MaPhong);

        if (totalFee === 0) return response.success(res, { totalFee }, 'Không có phí xe cho phòng này');

        // Logic tạo hóa đơn tự động
        const MaHoaDon = `BX-${MaPhong}-${Date.now().toString().slice(-8)}`;

        await HoaDonModel.create({
            MaHoaDon,
            id_MaPhong: MaPhong,
            ThangThu: new Date().getMonth() + 1 + '/' + new Date().getFullYear(),
            TongTien: totalFee,
            TrangThai: 'Chưa thanh toán',
            HanDongTien: new Date(new Date().setDate(new Date().getDate() + 10))
        });

        // Phát tín hiệu Real-time
        req.io.emit('NEW_BILL', { MaHoaDon, id_MaPhong: MaPhong, TongTien: totalFee, type: 'Parking' });

        return response.success(res, { MaHoaDon, totalFee }, 'Đã tính phí và tạo hóa đơn bãi xe thành công');

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
