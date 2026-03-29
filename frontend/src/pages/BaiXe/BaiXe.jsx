import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiTruck } from 'react-icons/fi';
import { baiXeAPI, cuDanAPI } from '../../services/api';

const BaiXe = () => {
    const [list, setList] = useState([]);
    const [cuDanList, setCuDanList] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({ MaTheXe: '', BienSoXe: '', LoaiXe: 'Xe máy', MaCuDan: '', TrangThai: 'Đang sử dụng' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [bxRes, cdRes] = await Promise.all([baiXeAPI.getAll(), cuDanAPI.getAll()]);
            setList(bxRes.data.data || []);
            setCuDanList(cdRes.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await baiXeAPI.update(editingItem.MaTheXe, form);
            } else {
                await baiXeAPI.create(form);
            }
            setShowModal(false);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra');
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
        bx.TenCuDan?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div>
            <div className="page-header">
                <h1>Quản Lý Bãi Xe</h1>
                <button className="btn btn-primary" onClick={() => { setEditingItem(null); setForm({ MaTheXe: '', BienSoXe: '', LoaiXe: 'Xe máy', MaCuDan: '', TrangThai: 'Đang sử dụng' }); setShowModal(true); }}>
                    <FiPlus /> Đăng Ký Thẻ Xe
                </button>
            </div>

            <div className="filter-bar">
                <div className="search-bar" style={{ flex: 1, maxWidth: 400 }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="Tìm biển số, mã thẻ, chủ xe..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="table-container">
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
                        {filtered.map((bx) => (
                            <tr key={bx.MaTheXe}>
                                <td style={{ fontWeight: 600 }}>{bx.MaTheXe}</td>
                                <td>{bx.BienSoXe}</td>
                                <td>
                                    <span className={`badge ${bx.LoaiXe === 'Ô tô' ? 'badge-blue' : 'badge-gray'}`}>
                                        {bx.LoaiXe === 'Ô tô' ? '🚗 Ô tô' : '🛵 Xe máy'}
                                    </span>
                                </td>
                                <td>{bx.TenCuDan || '—'}</td>
                                <td>{bx.MaPhong || '—'}</td>
                                <td><span className={`badge ${bx.TrangThai === 'Đang sử dụng' ? 'badge-green' : 'badge-orange'}`}>{bx.TrangThai}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button className="btn-icon" onClick={() => { setEditingItem(bx); setForm({ ...bx }); setShowModal(true); }}><FiEdit2 /></button>
                                        <button className="btn-icon" onClick={() => handleDelete(bx.MaTheXe)} style={{ color: 'var(--error)' }}><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Cập Nhật Thẻ Xe' : 'Đăng Ký Thẻ Xe Mới'}</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Mã Thẻ Xe *</label>
                                <input className="form-control" required value={form.MaTheXe} disabled={!!editingItem}
                                    onChange={(e) => setForm({ ...form, MaTheXe: e.target.value })} placeholder="VD: TX001" />
                            </div>
                            <div className="form-group">
                                <label>Biển Số Xe *</label>
                                <input className="form-control" required value={form.BienSoXe}
                                    onChange={(e) => setForm({ ...form, BienSoXe: e.target.value })} placeholder="VD: 30A-123.45" />
                            </div>
                            <div className="form-group">
                                <label>Loại Xe</label>
                                <select className="form-control" value={form.LoaiXe} onChange={(e) => setForm({ ...form, LoaiXe: e.target.value })}>
                                    <option value="Xe máy">🛵 Xe máy</option>
                                    <option value="Ô tô">🚗 Ô tô</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Chủ Xe (Cư dân)</label>
                                <select className="form-control" value={form.MaCuDan} onChange={(e) => setForm({ ...form, MaCuDan: e.target.value })}>
                                    <option value="">-- Chọn cư dân --</option>
                                    {cuDanList.map(cd => (
                                        <option key={cd.MaCuDan} value={cd.MaCuDan}>{cd.HoTen} ({cd.MaPhong})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Trạng Thái</label>
                                <select className="form-control" value={form.TrangThai} onChange={(e) => setForm({ ...form, TrangThai: e.target.value })}>
                                    <option value="Đang sử dụng">Đang sử dụng</option>
                                    <option value="Đã thu hồi">Đã thu hồi</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">{editingItem ? 'Cập Nhật' : 'Lưu'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaiXe;
