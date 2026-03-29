import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiDownload, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { hoaDonAPI, phongAPI } from '../../services/api';
import exportToExcel from '../../utils/exportExcel';

const HoaDon = () => {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedHD, setSelectedHD] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [phongList, setPhongList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        MaHoaDon: '', id_MaPhong: '', ThangThu: '',
        TongTien: 0, TrangThai: 'Chưa thanh toán',
        NgayTao: '', HanDongTien: ''
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [hdRes, pRes] = await Promise.allSettled([hoaDonAPI.getAll(), phongAPI.getAll()]);
            if (hdRes.status === 'fulfilled') setList(hdRes.value.data.data || []);
            if (pRes.status === 'fulfilled') setPhongList(pRes.value.data.data || []);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleExport = () => {
        const exportData = filtered.map(hd => ({
            'Mã HĐ': hd.MaHoaDon,
            'Phòng': hd.id_MaPhong,
            'Tháng Thu': hd.ThangThu,
            'Tổng Tiền': hd.TongTien,
            'Trạng Thái': hd.TrangThai,
            'Ngày Tạo': hd.NgayTao?.split('T')[0],
            'Hạn Đóng': hd.HanDongTien?.split('T')[0]
        }));
        exportToExcel(exportData, `Bao_Cao_Hoa_Don_${new Date().toLocaleDateString()}`);
    };

    const handlePaymentSubmit = async () => {
        try {
            await hoaDonAPI.update(selectedHD.MaHoaDon, { ...selectedHD, TrangThai: 'Đã thanh toán' });
            setShowPayModal(false);
            loadData();
        } catch (err) {
            alert('Lỗi thanh toán');
        }
    };

    const openCreate = () => { setEditingItem(null); setForm({ MaHoaDon: '', id_MaPhong: '', ThangThu: '', TongTien: 0, TrangThai: 'Chưa thanh toán', NgayTao: '', HanDongTien: '' }); setShowModal(true); };
    const openEdit = (item) => { setEditingItem(item); setForm({ ...item, NgayTao: item.NgayTao?.split('T')[0] || '', HanDongTien: item.HanDongTien?.split('T')[0] || '' }); setShowModal(true); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            editingItem ? await hoaDonAPI.update(editingItem.MaHoaDon, form) : await hoaDonAPI.create(form);
            setShowModal(false); loadData();
        } catch (err) { alert(err.response?.data?.message || 'Lỗi'); }
    };

    const handleDelete = async (ma) => { if (!confirm('Xóa hóa đơn?')) return; try { await hoaDonAPI.delete(ma); loadData(); } catch { alert('Lỗi'); } };

    const getBadge = (s) => { const m = { 'Đã thanh toán': 'badge-green', 'Chưa thanh toán': 'badge-orange', 'Quá hạn': 'badge-red' }; return m[s] || 'badge-gray'; };

    const filtered = list.filter(hd =>
        (hd.MaHoaDon?.toLowerCase().includes(search.toLowerCase()) || hd.id_MaPhong?.toLowerCase().includes(search.toLowerCase())) &&
        (!filterStatus || hd.TrangThai === filterStatus)
    );

    if (loading) return <div className="loading-spinner"></div>;

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <div className="page-header">
                <motion.h1 variants={itemVariants}>Quản Lý Hóa Đơn</motion.h1>
                <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button variants={itemVariants} className="btn btn-ghost" onClick={handleExport} whileHover={{ scale: 1.05 }}>
                        <FiDownload /> Xuất Báo Cáo
                    </motion.button>
                    <motion.button variants={itemVariants} className="btn btn-primary" onClick={openCreate} whileHover={{ scale: 1.05 }}>
                        <FiPlus /> Tạo Hóa Đơn
                    </motion.button>
                </div>
            </div>

            <motion.div className="filter-bar" variants={itemVariants}>
                <div className="search-bar" style={{ flex: 1, maxWidth: 350 }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="Tìm mã HĐ, phòng..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="form-control" style={{ width: 220 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="Chưa thanh toán">⚠️ Chưa thanh toán</option>
                    <option value="Đã thanh toán">✅ Đã thanh toán</option>
                    <option value="Quá hạn">⏰ Quá hạn</option>
                </select>
            </motion.div>

            <motion.div className="table-container" variants={itemVariants}>
                <table>
                    <thead><tr><th>Mã HĐ</th><th>Phòng</th><th>Tháng</th><th>Tổng Tiền</th><th>Trạng Thái</th><th>Ngày Tạo</th><th>Hạn Đóng</th><th>Thao Tác</th></tr></thead>
                    <tbody>
                        <AnimatePresence>
                            {filtered.length > 0 ? filtered.map(hd => (
                                <motion.tr key={hd.MaHoaDon} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={hd.TrangThai === 'Quá hạn' ? { background: 'rgba(211,47,47,0.04)' } : {}}>
                                    <td data-label="Mã HĐ" style={{ fontWeight: 600 }}>{hd.MaHoaDon}</td>
                                    <td data-label="Phòng">{hd.id_MaPhong}</td>
                                    <td data-label="Tháng">{hd.ThangThu}</td>
                                    <td data-label="Tổng Tiền" style={{ fontWeight: 600 }}>{hd.TongTien?.toLocaleString('vi-VN')}đ</td>
                                    <td data-label="Trạng Thái"><span className={`badge ${getBadge(hd.TrangThai)}`}>{hd.TrangThai}</span></td>
                                    <td data-label="Ngày Tạo">{hd.NgayTao?.split('T')[0]}</td>
                                    <td data-label="Hạn Đóng">{hd.HanDongTien?.split('T')[0]}</td>
                                    <td data-label="Thao Tác">
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            {hd.TrangThai === 'Chưa thanh toán' && (
                                                <button className="btn-icon" onClick={() => { setSelectedHD(hd); setShowPayModal(true); }} style={{ color: 'var(--primary)' }} title="Thanh toán QR">
                                                    <FiCreditCard />
                                                </button>
                                            )}
                                            <button className="btn-icon" onClick={() => openEdit(hd)}><FiEdit2 /></button>
                                            <button className="btn-icon" onClick={() => handleDelete(hd.MaHoaDon)} style={{ color: 'var(--error)' }}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr><td colSpan="8" className="empty-state">Chưa có hóa đơn nào</td></tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <div className="modal-header"><h2>{editingItem ? 'Cập Nhật' : 'Tạo'} Hóa Đơn</h2><button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button></div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-form-grid">
                                    <div className="form-group"><label>Mã Hóa Đơn *</label><input className="form-control" required value={form.MaHoaDon} disabled={!!editingItem} onChange={e => setForm({ ...form, MaHoaDon: e.target.value })} placeholder="HD-2026-001" /></div>
                                    <div className="form-group"><label>Phòng *</label><select className="form-control" required value={form.id_MaPhong} onChange={e => setForm({ ...form, id_MaPhong: e.target.value })}><option value="">-- Chọn --</option>{phongList.map(p => <option key={p.MaPhong} value={p.MaPhong}>{p.SoPhong}</option>)}</select></div>
                                    <div className="form-group"><label>Tháng Thu</label><input className="form-control" value={form.ThangThu} onChange={e => setForm({ ...form, ThangThu: e.target.value })} placeholder="03/2026" /></div>
                                    <div className="form-group"><label>Tổng Tiền</label><input type="number" className="form-control" value={form.TongTien} onChange={e => setForm({ ...form, TongTien: parseFloat(e.target.value) || 0 })} /></div>
                                    <div className="form-group"><label>Trạng Thái</label><select className="form-control" value={form.TrangThai} onChange={e => setForm({ ...form, TrangThai: e.target.value })}><option value="Chưa thanh toán">Chưa thanh toán</option><option value="Đã thanh toán">Đã thanh toán</option><option value="Quá hạn">Quá hạn</option></select></div>
                                    <div className="form-group"><label>Ngày Tạo</label><input type="date" className="form-control" value={form.NgayTao} onChange={e => setForm({ ...form, NgayTao: e.target.value })} /></div>
                                    <div className="form-group"><label>Hạn Đóng Tiền</label><input type="date" className="form-control" value={form.HanDongTien} onChange={e => setForm({ ...form, HanDongTien: e.target.value })} /></div>
                                </div>
                                <div className="modal-footer"><button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button><button type="submit" className="btn btn-primary">{editingItem ? 'Cập Nhật' : 'Lưu Dự Liệu'}</button></div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPayModal && selectedHD && (
                    <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
                        <motion.div className="modal" style={{ maxWidth: 400, textAlign: 'center' }} onClick={e => e.stopPropagation()} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                            <div className="modal-header">
                                <h2>Thanh toán Hóa đơn</h2>
                                <button className="btn-icon" onClick={() => setShowPayModal(false)}><FiX /></button>
                            </div>
                            <div style={{ padding: '20px 0' }}>
                                <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginBottom: 12 }}>Quét mã QR để thanh toán cho HĐ <b>{selectedHD.MaHoaDon}</b></p>
                                <div style={{ background: '#fff', padding: 16, borderRadius: 16, display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BANK-PAYMENT-${selectedHD.MaHoaDon}-${selectedHD.TongTien}`} alt="QR Code" style={{ width: 200, height: 200 }} />
                                </div>
                                <div style={{ marginTop: 20, textAlign: 'left', padding: '0 20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Số tiền:</span><b>{selectedHD.TongTien?.toLocaleString()}đ</b></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Nội dung:</span><b>{selectedHD.MaHoaDon}</b></div>
                                </div>
                                <button className="btn btn-primary" style={{ width: '100%', height: 48, marginTop: 24 }} onClick={handlePaymentSubmit}>
                                    <FiCheckCircle /> Xác nhận Đã Thanh Toán
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default HoaDon;
