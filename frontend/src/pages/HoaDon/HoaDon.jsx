import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { hoaDonAPI, phongAPI } from '../../services/api';

const HoaDon = () => {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [phongList, setPhongList] = useState([]);
    const [form, setForm] = useState({ MaHoaDon: '', id_MaPhong: '', ThangThu: '', TongTien: 0, TrangThai: 'Chưa thanh toán', NgayTao: '', HanDongTien: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [hdRes, pRes] = await Promise.allSettled([hoaDonAPI.getAll(), phongAPI.getAll()]);
            if (hdRes.status === 'fulfilled') setList(hdRes.value.data.data || []);
            if (pRes.status === 'fulfilled') setPhongList(pRes.value.data.data || []);
        } catch (err) { console.error(err); } finally { setLoading(false); }
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

    return (
        <div>
            <div className="page-header">
                <h1>Quản Lý Hóa Đơn</h1>
                <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Tạo Hóa Đơn</button>
            </div>

            <div className="filter-bar">
                <div className="search-bar" style={{ flex: 1, maxWidth: 350 }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="Tìm mã HĐ, phòng..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="form-control" style={{ width: 200 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="Chưa thanh toán">Chưa thanh toán</option>
                    <option value="Đã thanh toán">Đã thanh toán</option>
                    <option value="Quá hạn">Quá hạn</option>
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead><tr><th>Mã HĐ</th><th>Phòng</th><th>Tháng</th><th>Tổng Tiền</th><th>Trạng Thái</th><th>Ngày Tạo</th><th>Hạn Đóng</th><th>Thao Tác</th></tr></thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(hd => (
                            <tr key={hd.MaHoaDon} style={hd.TrangThai === 'Quá hạn' ? { background: 'rgba(211,47,47,0.04)' } : {}}>
                                <td style={{ fontWeight: 600 }}>{hd.MaHoaDon}</td>
                                <td>{hd.id_MaPhong}</td>
                                <td>{hd.ThangThu}</td>
                                <td style={{ fontWeight: 600 }}>{hd.TongTien?.toLocaleString('vi-VN')}đ</td>
                                <td><span className={`badge ${getBadge(hd.TrangThai)}`}>{hd.TrangThai}</span></td>
                                <td>{hd.NgayTao?.split('T')[0]}</td>
                                <td>{hd.HanDongTien?.split('T')[0]}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button className="btn-icon" onClick={() => openEdit(hd)}><FiEdit2 /></button>
                                        <button className="btn-icon" onClick={() => handleDelete(hd.MaHoaDon)} style={{ color: 'var(--error)' }}><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="8" className="empty-state">Chưa có hóa đơn nào</td></tr>}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h2>{editingItem ? 'Cập Nhật' : 'Tạo'} Hóa Đơn</h2><button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button></div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-form-grid">
                                <div className="form-group"><label>Mã Hóa Đơn *</label><input className="form-control" required value={form.MaHoaDon} disabled={!!editingItem} onChange={e => setForm({ ...form, MaHoaDon: e.target.value })} placeholder="HD-2026-001" /></div>
                                <div className="form-group"><label>Phòng *</label><select className="form-control" required value={form.id_MaPhong} onChange={e => setForm({ ...form, id_MaPhong: e.target.value })}><option value="">-- Chọn --</option>{phongList.map(p => <option key={p.MaPhong} value={p.MaPhong}>{p.SoPhong}</option>)}</select></div>
                                <div className="form-group"><label>Tháng Thu</label><input className="form-control" value={form.ThangThu} onChange={e => setForm({ ...form, ThangThu: e.target.value })} placeholder="03/2026" /></div>
                                <div className="form-group"><label>Tổng Tiền</label><input type="number" className="form-control" value={form.TongTien} onChange={e => setForm({ ...form, TongTien: parseFloat(e.target.value) || 0 })} /></div>
                                <div className="form-group"><label>Trạng Thái</label><select className="form-control" value={form.TrangThai} onChange={e => setForm({ ...form, TrangThai: e.target.value })}><option>Chưa thanh toán</option><option>Đã thanh toán</option><option>Quá hạn</option></select></div>
                                <div className="form-group"><label>Ngày Tạo</label><input type="date" className="form-control" value={form.NgayTao} onChange={e => setForm({ ...form, NgayTao: e.target.value })} /></div>
                                <div className="form-group"><label>Hạn Đóng Tiền</label><input type="date" className="form-control" value={form.HanDongTien} onChange={e => setForm({ ...form, HanDongTien: e.target.value })} /></div>
                            </div>
                            <div className="modal-footer"><button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button><button type="submit" className="btn btn-primary">{editingItem ? 'Cập Nhật' : 'Lưu'}</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HoaDon;
