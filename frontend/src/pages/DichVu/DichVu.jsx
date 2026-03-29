import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { dichVuAPI } from '../../services/api';

const DichVu = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({ MaDichVu: '', TenDichVu: '', DonGia: 0, DonViTinh: '', LoaiDichVu: 1 });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await dichVuAPI.getAll();
            setList(res.data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditingItem(null);
        setForm({ MaDichVu: '', TenDichVu: '', DonGia: 0, DonViTinh: '', LoaiDichVu: 1 });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setForm({ ...item });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) await dichVuAPI.update(editingItem.MaDichVu, form);
            else await dichVuAPI.create(form);
            setShowModal(false); loadData();
        } catch (err) { alert(err.response?.data?.message || 'Lỗi'); }
    };

    const handleDelete = async (ma) => {
        if (!confirm('Xóa dịch vụ này?')) return;
        try { await dichVuAPI.delete(ma); loadData(); } catch { alert('Lỗi'); }
    };

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div>
            <div className="page-header">
                <h1>Danh Sách Dịch Vụ</h1>
                <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Thêm Dịch Vụ</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã DV</th>
                            <th>Tên Dịch Vụ</th>
                            <th>Đơn Giá</th>
                            <th>Đơn Vị</th>
                            <th>Loại</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(dv => (
                            <tr key={dv.MaDichVu}>
                                <td style={{ fontWeight: 600 }}>{dv.MaDichVu}</td>
                                <td>{dv.TenDichVu}</td>
                                <td>{dv.DonGia?.toLocaleString('vi-VN')} đ</td>
                                <td>{dv.DonViTinh}</td>
                                <td>
                                    <span className={`badge ${dv.LoaiDichVu === 1 ? 'badge-blue' : 'badge-orange'}`}>
                                        {dv.LoaiDichVu === 1 ? 'Đo lường' : 'Cố định'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button className="btn-icon" onClick={() => openEdit(dv)}><FiEdit2 /></button>
                                        <button className="btn-icon" onClick={() => handleDelete(dv.MaDichVu)} style={{ color: 'var(--error)' }}><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Mã Dịch Vụ *</label>
                                <input className="form-control" required value={form.MaDichVu} disabled={!!editingItem}
                                    onChange={e => setForm({ ...form, MaDichVu: e.target.value })} placeholder="VD: DV001" />
                            </div>
                            <div className="form-group">
                                <label>Tên Dịch Vụ *</label>
                                <input className="form-control" required value={form.TenDichVu}
                                    onChange={e => setForm({ ...form, TenDichVu: e.target.value })} placeholder="VD: Tiền Điện" />
                            </div>
                            <div className="modal-form-grid">
                                <div className="form-group">
                                    <label>Đơn Giá (đ)</label>
                                    <input type="number" className="form-control" value={form.DonGia}
                                        onChange={e => setForm({ ...form, DonGia: parseFloat(e.target.value) || 0 })} />
                                </div>
                                <div className="form-group">
                                    <label>Đơn Vị Tính</label>
                                    <input className="form-control" value={form.DonViTinh}
                                        onChange={e => setForm({ ...form, DonViTinh: e.target.value })} placeholder="kWh, m3, tháng..." />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Loại Dịch Vụ</label>
                                <select className="form-control" value={form.LoaiDichVu}
                                    onChange={e => setForm({ ...form, LoaiDichVu: parseInt(e.target.value) })}>
                                    <option value={1}>Loại 1 - Đo lường (Điện, Nước...)</option>
                                    <option value={2}>Loại 2 - Cố định (Gửi xe, Phí quản lý...)</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DichVu;
