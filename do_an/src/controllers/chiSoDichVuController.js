const ChiSoDichVuModel = require('../models/chiSoDichVuModel');
const HoaDonModel = require('../models/hoaDonModel');
const DanhSachDichVuModel = require('../models/danhSachDichVuModel');
const response = require('../utils/responseFormat');
const asyncHandler = require('../utils/asyncHandler');

// Tính thành tiền dựa theo loại dịch vụ
const tinhThanhTien = (dichVu, data) => {
    if (dichVu.LoaiDichVu === 1) {
        // Loại 1: Đo lường (Điện, Nước) = (Chỉ số mới - Chỉ số cũ) * Đơn giá
        return ((data.ChiSoHienTai || 0) - (data.ChiSoLanGhiTruoc || 0)) * dichVu.DonGia;
    } else {
        // Loại 2: Cố định (Gửi xe, Rác) = Số lượng * Đơn giá
        return (data.SoLuong || 0) * dichVu.DonGia;
    }
};

const ChiSoDichVuController = {
    getAll: asyncHandler(async (req, res) => {
        const data = await ChiSoDichVuModel.getAll();
        return response.success(res, data, 'Lấy danh sách chỉ số dịch vụ thành công');
    }),

    getByMa: asyncHandler(async (req, res) => {
        const { MaGhi } = req.params;
        const data = await ChiSoDichVuModel.getByMa(MaGhi);
        if (!data) return response.error(res, 'Không tìm thấy chỉ số', 404);
        return response.success(res, data, 'Lấy thông tin chỉ số thành công');
    }),

    // Lấy chi tiết của một hóa đơn
    getByHoaDon: asyncHandler(async (req, res) => {
        const { MaHoaDon } = req.params;
        const data = await ChiSoDichVuModel.getByHoaDon(MaHoaDon);
        return response.success(res, data, 'Lấy chi tiết hóa đơn thành công');
    }),

    // Ghi chỉ số và tự động tính tiền vào hóa đơn
    create: asyncHandler(async (req, res) => {
        const { MaGhi, id_MaDichVu, id_MaHoaDon, ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi } = req.body;
        if (!MaGhi || !id_MaDichVu || !id_MaHoaDon) {
            return response.error(res, 'MaGhi, id_MaDichVu và id_MaHoaDon là bắt buộc', 400);
        }

        // Kiểm tra dịch vụ tồn tại
        const dichVu = await DanhSachDichVuModel.getByMa(id_MaDichVu);
        if (!dichVu) return response.error(res, 'Không tìm thấy dịch vụ', 404);

        // Kiểm tra hóa đơn tồn tại
        const hoaDon = await HoaDonModel.getByMa(id_MaHoaDon);
        if (!hoaDon) return response.error(res, 'Không tìm thấy hóa đơn', 404);

        // Ghi chỉ số
        await ChiSoDichVuModel.create({ MaGhi, id_MaDichVu, id_MaHoaDon, ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi });

        // Tính lại TongTien cho hóa đơn
        const allChiSo = await ChiSoDichVuModel.getByHoaDon(id_MaHoaDon);
        const tongTien = allChiSo.reduce((sum, cs) => {
            if (cs.LoaiDichVu === 1) {
                return sum + ((cs.ChiSoHienTai || 0) - (cs.ChiSoLanGhiTruoc || 0)) * cs.DonGia;
            }
            return sum + (cs.SoLuong || 0) * cs.DonGia;
        }, 0);

        await HoaDonModel.update(id_MaHoaDon, { TongTien: tongTien, TrangThai: hoaDon.TrangThai, HanDongTien: hoaDon.HanDongTien });

        return response.success(res, { MaGhi, TongTienMoi: tongTien }, 'Ghi chỉ số thành công', 201);
    }),

    update: asyncHandler(async (req, res) => {
        const { MaGhi } = req.params;
        const { ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi } = req.body;

        const existing = await ChiSoDichVuModel.getByMa(MaGhi);
        if (!existing) return response.error(res, 'Không tìm thấy chỉ số', 404);

        await ChiSoDichVuModel.update(MaGhi, { ChiSoLanGhiTruoc, ChiSoHienTai, SoLuong, NgayGhi });
        return response.success(res, null, 'Cập nhật chỉ số thành công');
    }),

    delete: asyncHandler(async (req, res) => {
        const { MaGhi } = req.params;
        const existing = await ChiSoDichVuModel.getByMa(MaGhi);
        if (!existing) return response.error(res, 'Không tìm thấy chỉ số', 404);

        await ChiSoDichVuModel.delete(MaGhi);
        return response.success(res, null, 'Xóa chỉ số thành công');
    })
};

module.exports = ChiSoDichVuController;
