const SuCoModel = require('../models/suCoModel');
const response = require('../utils/responseFormat');
const asyncHandler = require('../utils/asyncHandler');

const generateMaSuCo = () => 'SC' + Date.now().toString().slice(-8);

const SuCoController = {
    getAll: asyncHandler(async (req, res) => {
        const data = await SuCoModel.getAll();
        return response.success(res, data, 'Lấy danh sách sự cố thành công');
    }),

    getByMa: asyncHandler(async (req, res) => {
        const { MaSuCo } = req.params;
        const data = await SuCoModel.getByMa(MaSuCo);
        if (!data) return response.error(res, 'Không tìm thấy sự cố', 404);
        return response.success(res, data, 'Lấy thông tin sự cố thành công');
    }),

    getByTrangThai: asyncHandler(async (req, res) => {
        const { TrangThai } = req.params;
        const data = await SuCoModel.getByTrangThai(TrangThai);
        return response.success(res, data, 'Lấy danh sách sự cố theo trạng thái thành công');
    }),

    getByNguoiBao: asyncHandler(async (req, res) => {
        const { MaNguoiBao } = req.params;
        const data = await SuCoModel.getByNguoiBao(MaNguoiBao);
        return response.success(res, data, 'Lấy danh sách sự cố theo người báo thành công');
    }),

    getByPhong: asyncHandler(async (req, res) => {
        const { MaPhong } = req.params;
        const data = await SuCoModel.getByPhong(MaPhong);
        return response.success(res, data, 'Lấy danh sách sự cố theo phòng thành công');
    }),

    create: asyncHandler(async (req, res) => {
        const { MaSuCo, MaNguoiBao, MaPhong, TenSuCo, MoTa, AnhSuCo, NgayBaoCao, MucDoUuTien } = req.body;
        if (!TenSuCo || !MoTa) return response.error(res, 'TenSuCo và MoTa là bắt buộc', 400);

        const maSuCo = MaSuCo || generateMaSuCo();
        await SuCoModel.create({ MaSuCo: maSuCo, MaNguoiBao, MaPhong, TenSuCo, MoTa, AnhSuCo, NgayBaoCao, MucDoUuTien });
        return response.success(res, { MaSuCo: maSuCo }, 'Báo cáo sự cố thành công', 201);
    }),

    update: asyncHandler(async (req, res) => {
        const { MaSuCo } = req.params;
        const { TenSuCo, MoTa, AnhSuCo, TrangThai, NguoiXuly, NgayXuLy, GhiChuBQL } = req.body;

        const existing = await SuCoModel.getByMa(MaSuCo);
        if (!existing) return response.error(res, 'Không tìm thấy sự cố', 404);

        await SuCoModel.update(MaSuCo, { TenSuCo, MoTa, AnhSuCo, TrangThai, NguoiXuly, NgayXuLy, GhiChuBQL });
        return response.success(res, null, 'Cập nhật sự cố thành công');
    }),


    // Cập nhật nhanh trạng thái xử lý
    xuLy: asyncHandler(async (req, res) => {
        const { MaSuCo } = req.params;
        const { TrangThai, NguoiXuly, NgayXuLy } = req.body;

        const existing = await SuCoModel.getByMa(MaSuCo);
        if (!existing) return response.error(res, 'Không tìm thấy sự cố', 404);

        await SuCoModel.updateTrangThai(MaSuCo, TrangThai, NguoiXuly, NgayXuLy);
        return response.success(res, null, 'Cập nhật trạng thái sự cố thành công');
    }),

    delete: asyncHandler(async (req, res) => {
        const { MaSuCo } = req.params;
        const existing = await SuCoModel.getByMa(MaSuCo);
        if (!existing) return response.error(res, 'Không tìm thấy sự cố', 404);

        await SuCoModel.delete(MaSuCo);
        return response.success(res, null, 'Xóa sự cố thành công');
    })
};

module.exports = SuCoController;
