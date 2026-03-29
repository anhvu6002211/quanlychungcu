import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { chiSoDichVuAPI, hoaDonAPI, dichVuAPI } from '../../services/api';

const ChiSoDichVu = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [dichVuList, setDichVuList] = useState([]);
    const [hoaDonList, setHoaDonList] = useState([]);
    const [form, setForm] = useState({ MaChiSo: '', id_MaDichVu: '', id_MaHoaDon: '', SoLuong: 0 });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [csRes, dvRes, hdRes] = await Promise.allSettled([
                chiSoDichVuAPI.getAll(),
                dichVuAPI.getAll(),
                hoaDonAPI.getAll(),
            ]);
            if (csRes.status === 'fulfilled') setList(csRes.value.data.data || []);
            if (dvRes.status === 'fulfilled') setDichVuList(dvRes.value.data.data || []);
            if (hdRes.status === 'fulfilled') setHoaDonList(hdRes.value.data.data || []);
        } catch (err) { console.error('Lỗi tải chỉ số:', err); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditingItem(null);
        setForm({ MaChiSo: '', id_MaDichVu: '', id_MaHoaDon: '', SoLuong: 0 });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) await chiSoDichVuAPI.update(editingItem.MaChiSo, form);
            else await chiSoDichVuAPI.create(form);
            setShowModal(false); loadData();
        } catch (err) { alert(err.response?.data?.message || 'Lỗi'); }
    };

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div>
            <div className="page-header">
                <h1>Ghi Chỉ Số Dịch Vụ</h1>
                <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Ghi Chỉ Số Mới</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã CS</th>
                            <th>Hóa Đơn</th>
                            <th>Dịch Vụ</th>
                            <th>Số Lượng</th>
                            <th>Tổng Tiền</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length > 0 ? list.map(cs => (
                            <tr key={cs.MaChiSo}>
                                <td data-label="Mã CS" style={{ fontWeight: 600 }}>{cs.MaChiSo}</td>
                                <td data-label="Hóa Đơn"><span className="badge badge-gray">{cs.id_MaHoaDon}</span></td>
                                <td data-label="Dịch Vụ">{cs.id_MaDichVu}</td>
                                <td data-label="Số Lượng"><span style={{ fontWeight: 600 }}>{cs.SoLuong}</span></td>
                                <td data-label="Tổng Tiền" style={{ color: 'var(--primary)', fontWeight: 600 }}>{cs.TongTien?.toLocaleString('vi-VN')} đ</td>
                                <td data-label="Thao Tác">
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button className="btn-icon" onClick={() => { setEditingItem(cs); setForm({ ...cs }); setShowModal(true); }}><FiEdit2 /></button>
                                        <button className="btn-icon" style={{ color: 'var(--error)' }} onClick={async () => { if (confirm('Xóa bản ghi này?')) { try { await chiSoDichVuAPI.delete(cs.MaChiSo); loadData(); } catch { alert('Lỗi'); } } }}><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="6" className="empty-state">Chưa có chỉ số nào được ghi</td></tr>}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Sửa Chỉ Số' : 'Ghi Chỉ Số Mới'}</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Mã Bản Ghi *</label>
                                <input className="form-control" required value={form.MaChiSo} disabled={!!editingItem}
                                    onChange={e => setForm({ ...form, MaChiSo: e.target.value })} placeholder="VD: CS001" />
                            </div>
                            <div className="form-group">
                                <label>Dòng Hóa Đơn *</label>
                                <select className="form-control" required value={form.id_MaHoaDon}
                                    onChange={e => setForm({ ...form, id_MaHoaDon: e.target.value })}>
                                    <option value="">-- Chọn hóa đơn --</option>
                                    {hoaDonList.map(hd => <option key={hd.MaHoaDon} value={hd.MaHoaDon}>{hd.MaHoaDon} (Phòng: {hd.id_MaPhong} - {hd.ThangThu})</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Dịch Vụ *</label>
                                <select className="form-control" required value={form.id_MaDichVu}
                                    onChange={e => setForm({ ...form, id_MaDichVu: e.target.value })}>
                                    <option value="">-- Chọn dịch vụ --</option>
                                    {dichVuList.map(dv => <option key={dv.MaDichVu} value={dv.MaDichVu}>{dv.TenDichVu} ({dv.DonGia?.toLocaleString('vi-VN')} đ/{dv.DonViTinh})</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Số Lượng (Chỉ số mới - Chỉ số cũ)</label>
                                <input type="number" className="form-control" value={form.SoLuong} required
                                    onChange={e => setForm({ ...form, SoLuong: parseFloat(e.target.value) || 0 })} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">Lưu bản ghi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChiSoDichVu;
