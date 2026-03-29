import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiDollarSign, FiCheckCircle, FiDownload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { baiXeAPI, cuDanAPI, phongAPI } from '../../services/api';
import exportToExcel from '../../utils/exportExcel';

const BaiXe = () => {
    const [list, setList] = useState([]);
    const [cuDanList, setCuDanList] = useState([]);
    const [phongList, setPhongList] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showFeeModal, setShowFeeModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [calculating, setCalculating] = useState(false);
    const [form, setForm] = useState({ MaTheXe: '', BienSoXe: '', LoaiXe: 'Xe máy', MaCuDan: '', TrangThai: 'Đang sử dụng' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [bxRes, cdRes, pRes] = await Promise.all([
                baiXeAPI.getAll(),
                cuDanAPI.getAll(),
                phongAPI.getAll()
            ]);
            setList(bxRes.data.data || []);
            setCuDanList(cdRes.data.data || []);
            setPhongList(pRes.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const exportData = filtered.map(bx => ({
            'Mã Thẻ': bx.MaTheXe,
            'Biển Số': bx.BienSoXe,
            'Loại Xe': bx.LoaiXe,
            'Chủ Xe': bx.TenCuDan,
            'Phòng': bx.MaPhong,
            'Trạng Thái': bx.TrangThai
        }));
        exportToExcel(exportData, `Bao_Cao_Bai_Xe_${new Date().toLocaleDateString()}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) await baiXeAPI.update(editingItem.MaTheXe, form);
            else await baiXeAPI.create(form);
            setShowModal(false);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleCalculateFee = async () => {
        if (!selectedRoom) return alert('Vui lòng chọn phòng');
        setCalculating(true);
        try {
            const res = await baiXeAPI.calculateFee(selectedRoom);
            alert(res.data.message);
            setShowFeeModal(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi tính phí');
        } finally {
            setCalculating(false);
        }
    };

    const handleDelete = async (ma) => {
        if (!confirm('Xóa thẻ xe này?')) return;
        try {
            await baiXeAPI.delete(ma);
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = list.filter(bx =>
        bx.BienSoXe?.toLowerCase().includes(search.toLowerCase()) ||
        bx.MaTheXe?.toLowerCase().includes(search.toLowerCase()) ||
        bx.TenCuDan?.toLowerCase().includes(search.toLowerCase()) ||
        bx.MaPhong?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="loading-spinner"></div>;

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <div className="page-header">
                <motion.h1 variants={itemVariants}>Quản Lý Bãi Xe</motion.h1>
                <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button variants={itemVariants} className="btn btn-ghost" onClick={handleExport} whileHover={{ scale: 1.05 }}>
                        <FiDownload /> Xuất Báo Cáo
                    </motion.button>
                    <motion.button variants={itemVariants} className="btn btn-ghost" onClick={() => setShowFeeModal(true)} whileHover={{ scale: 1.05 }}>
                        <FiDollarSign /> Chốt Phí Bãi Xe
                    </motion.button>
                    <motion.button variants={itemVariants} className="btn btn-primary" onClick={() => { setEditingItem(null); setForm({ MaTheXe: '', BienSoXe: '', LoaiXe: 'Xe máy', MaCuDan: '', TrangThai: 'Đang sử dụng' }); setShowModal(true); }}>
                        <FiPlus /> Đăng Ký Thẻ Xe
                    </motion.button>
                </div>
            </div>

            <motion.div className="filter-bar" variants={itemVariants}>
                <div className="search-bar" style={{ flex: 1, maxWidth: 400 }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="Tìm biển số, mã thẻ, chủ xe, phòng..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </motion.div>

            <motion.div className="table-container" variants={itemVariants}>
                <table>
                    <thead>
                        <tr>
                            <th>Mã Thẻ</th>
                            <th>Biển Số</th>
                            <th>Loại Xe</th>
                            <th>Chủ Xe</th>
                            <th>Phòng</th>
                            <th>Trạng Thái</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filtered.map((bx) => (
                                <motion.tr key={bx.MaTheXe} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <td style={{ fontWeight: 600 }}>{bx.MaTheXe}</td>
                                    <td>{bx.BienSoXe}</td>
                                    <td>
                                        <span className={`badge ${bx.LoaiXe === 'Ô tô' ? 'badge-blue' : (bx.LoaiXe === 'Xe máy' ? 'badge-orange' : 'badge-gray')}`}>
                                            {bx.LoaiXe === 'Ô tô' ? '🚗 Ô tô' : (bx.LoaiXe === 'Xe máy' ? '🛵 Xe máy' : '🚲 Xe đạp')}
                                        </span>
                                    </td>
                                    <td>{bx.TenCuDan || '—'}</td>
                                    <td style={{ fontWeight: 600 }}>{bx.MaPhong || '—'}</td>
                                    <td><span className={`badge ${bx.TrangThai === 'Đang sử dụng' ? 'badge-green' : 'badge-orange'}`}>{bx.TrangThai}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button className="btn-icon" onClick={() => { setEditingItem(bx); setForm({ ...bx }); setShowModal(true); }}><FiEdit2 /></button>
                                            <button className="btn-icon" onClick={() => handleDelete(bx.MaTheXe)} style={{ color: 'var(--error)' }}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </motion.div>

            {/* Modal Thẻ Xe */}
            <AnimatePresence>
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <motion.div className="modal" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <div className="modal-header">
                                <h2>{editingItem ? 'Cập Nhật Thẻ Xe' : 'Đăng Ký Thẻ Xe Mới'}</h2>
                                <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-form-grid">
                                    <div className="form-group"><label>Mã Thẻ Xe *</label><input className="form-control" required value={form.MaTheXe} disabled={!!editingItem} onChange={(e) => setForm({ ...form, MaTheXe: e.target.value })} placeholder="VD: TX001" /></div>
                                    <div className="form-group"><label>Biển Số Xe *</label><input className="form-control" required value={form.BienSoXe} onChange={(e) => setForm({ ...form, BienSoXe: e.target.value })} placeholder="VD: 30A-123.45" /></div>
                                    <div className="form-group"><label>Loại Xe</label>
                                        <select className="form-control" value={form.LoaiXe} onChange={(e) => setForm({ ...form, LoaiXe: e.target.value })}>
                                            <option value="Xe đạp">🚲 Xe đạp</option>
                                            <option value="Xe máy">🛵 Xe máy</option>
                                            <option value="Ô tô">🚗 Ô tô</option>
                                        </select>
                                    </div>
                                    <div className="form-group"><label>Trạng Thái</label>
                                        <select className="form-control" value={form.TrangThai} onChange={(e) => setForm({ ...form, TrangThai: e.target.value })}>
                                            <option value="Đang sử dụng">Đang sử dụng</option>
                                            <option value="Đã thu hồi">Đã thu hồi</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group"><label>Chủ Xe (Cư dân)</label>
                                    <select className="form-control" required value={form.MaCuDan} onChange={(e) => setForm({ ...form, MaCuDan: e.target.value })}>
                                        <option value="">-- Chọn cư dân --</option>
                                        {cuDanList.map(cd => <option key={cd.MaCuDan} value={cd.MaCuDan}>{cd.HoTen} ({cd.MaPhong})</option>)}
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                                    <button type="submit" className="btn btn-primary">{editingItem ? 'Cập Nhật' : 'Lưu Dự Liệu'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal Tính Phí */}
            <AnimatePresence>
                {showFeeModal && (
                    <div className="modal-overlay" onClick={() => setShowFeeModal(false)}>
                        <motion.div className="modal" style={{ maxWidth: 450 }} onClick={(e) => e.stopPropagation()} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                            <div className="modal-header">
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiDollarSign /> Chốt Phí Bãi Xe</h2>
                                <button className="btn-icon" onClick={() => setShowFeeModal(false)}><FiX /></button>
                            </div>
                            <div style={{ padding: '20px 0' }}>
                                <p style={{ marginBottom: 16, fontSize: 14 }}>Hệ thống sẽ dựa trên danh sách xe hiện tại để tạo hóa đơn phí gửi xe tháng này cho căn hộ.</p>
                                <div className="form-group">
                                    <label>Chọn Căn Hộ Cần Chốt Phí</label>
                                    <select className="form-control" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                                        <option value="">-- Chọn phòng --</option>
                                        {phongList.map(p => <option key={p.MaPhong} value={p.MaPhong}>{p.SoPhong}</option>)}
                                    </select>
                                </div>
                                <button className="btn btn-primary" style={{ width: '100%', height: 48, marginTop: 12 }} onClick={handleCalculateFee} disabled={calculating}>
                                    {calculating ? 'Đang xử lý...' : <><FiCheckCircle /> Xác Nhận & Tạo Hóa Đơn</>}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default BaiXe;
