import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheckCircle } from 'react-icons/fi';
import { suCoAPI, phongAPI } from '../../services/api';

const SuCo = () => {
    const [list, setList] = useState([]);
    const [phongList, setPhongList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({ MaSuCo: '', id_MaPhong: '', MoTa: '', NgayBao: '', TrangThai: 'Mới báo', NguoiXuLy: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [scRes, pRes] = await Promise.allSettled([suCoAPI.getAll(), phongAPI.getAll()]);
            if (scRes.status === 'fulfilled') setList(scRes.value.data.data || []);
            if (pRes.status === 'fulfilled') setPhongList(pRes.value.data.data || []);
        } catch (err) { console.error('Lỗi tải sự cố:', err); }
        finally { setLoading(false); }
    };

    const getStatusColor = (s) => {
        switch (s) {
            case 'Mới báo': return 'badge-red';
            case 'Đang xử lý': return 'badge-orange';
            case 'Đã xử lý': return 'badge-green';
            default: return 'badge-gray';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) await suCoAPI.update(editingItem.MaSuCo, form);
            else await suCoAPI.create(form);
            setShowModal(false); loadData();
        } catch (err) { alert(err.response?.data?.message || 'Lỗi'); }
    };

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div>
            <div className="page-header">
                <h1>Quản Lý Sự Cố</h1>
                <button className="btn btn-primary" onClick={() => { setEditingItem(null); setForm({ MaSuCo: '', id_MaPhong: '', MoTa: '', NgayBao: new Date().toISOString().split('T')[0], TrangThai: 'Mới báo', NguoiXuLy: '' }); setShowModal(true); }}>
                    <FiPlus /> Báo Sự Cố Mới
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã Sự Cố</th>
                            <th>Phòng</th>
                            <th>Mô Tả</th>
                            <th>Ngày Báo</th>
                            <th>Trạng Thái</th>
                            <th>Người Xử Lý</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length > 0 ? list.map(sc => (
                            <tr key={sc.MaSuCo}>
                                <td style={{ fontWeight: 600 }}>{sc.MaSuCo}</td>
                                <td>{sc.id_MaPhong}</td>
                                <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sc.MoTa}</td>
                                <td>{sc.NgayBao?.split('T')[0]}</td>
                                <td><span className={`badge ${getStatusColor(sc.TrangThai)}`}>{sc.TrangThai}</span></td>
                                <td>{sc.NguoiXuLy || '—'}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button className="btn-icon" title="Cập nhật" onClick={() => { setEditingItem(sc); setForm({ ...sc, NgayBao: sc.NgayBao?.split('T')[0] || '' }); setShowModal(true); }}><FiEdit2 /></button>
                                        <button className="btn-icon" style={{ color: 'var(--error)' }} onClick={async () => { if (confirm('Xóa báo cáo này?')) { try { await suCoAPI.delete(sc.MaSuCo); loadData(); } catch { alert('Lỗi'); } } }}><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="7" className="empty-state">Hiện không có sự cố nào</td></tr>}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Sửa Thông Tin Sự Cố' : 'Báo Sự Cố Mới'}</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Mã Sự Cố *</label>
                                <input className="form-control" required value={form.MaSuCo} disabled={!!editingItem}
                                    onChange={e => setForm({ ...form, MaSuCo: e.target.value })} placeholder="VD: SC001" />
                            </div>
                            <div className="form-group">
                                <label>Phòng Báo Sự Cố *</label>
                                <select className="form-control" required value={form.id_MaPhong}
                                    onChange={e => setForm({ ...form, id_MaPhong: e.target.value })}>
                                    <option value="">-- Chọn phòng --</option>
                                    {phongList.map(p => <option key={p.MaPhong} value={p.MaPhong}>{p.SoPhong}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Ghi Chú/Mô Tả *</label>
                                <textarea className="form-control" rows={4} required value={form.MoTa}
                                    onChange={e => setForm({ ...form, MoTa: e.target.value })} placeholder="Cần mô tả chi tiết sự cố cần sửa chữa..." />
                            </div>
                            <div className="modal-form-grid">
                                <div className="form-group">
                                    <label>Ngày Báo</label>
                                    <input type="date" className="form-control" value={form.NgayBao}
                                        onChange={e => setForm({ ...form, NgayBao: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Trạng Thái</label>
                                    <select className="form-control" value={form.TrangThai}
                                        onChange={e => setForm({ ...form, TrangThai: e.target.value })}>
                                        <option value="Mới báo">Mới báo</option>
                                        <option value="Đang xử lý">Đang xử lý</option>
                                        <option value="Đã xử lý">Đã xử lý</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Người Phụ Trách Hỗ Trợ Xử Lý</label>
                                <input className="form-control" value={form.NguoiXuLy}
                                    onChange={e => setForm({ ...form, NguoiXuLy: e.target.value })} placeholder="Tên kỹ thuật viên hoặc nhân viên BQL..." />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">{editingItem ? 'Cập Nhật' : 'Lưu Báo Cáo'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuCo;
