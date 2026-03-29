import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { cuDanAPI, phongAPI } from '../../services/api';

const CuDan = () => {
    const [cuDanList, setCuDanList] = useState([]);
    const [phongList, setPhongList] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({
        MaCuDan: '', HoTen: '', SoDienThoai: '', CCCD: '', QueQuan: '', MaPhong: '', MaNguoiDung: ''
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [cuDanRes, phongRes] = await Promise.allSettled([cuDanAPI.getAll(), phongAPI.getAll()]);
            if (cuDanRes.status === 'fulfilled') setCuDanList(cuDanRes.value.data.data || []);
            if (phongRes.status === 'fulfilled') setPhongList(phongRes.value.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditingItem(null);
        setForm({ MaCuDan: '', HoTen: '', SoDienThoai: '', CCCD: '', QueQuan: '', MaPhong: '', MaNguoiDung: '' });
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
            if (editingItem) {
                await cuDanAPI.update(editingItem.MaCuDan, form);
            } else {
                await cuDanAPI.create(form);
            }
            setShowModal(false);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleDelete = async (ma) => {
        if (!confirm('Bạn có chắc chắn muốn xóa cư dân này?')) return;
        try {
            await cuDanAPI.delete(ma);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi xóa');
        }
    };

    const filtered = cuDanList.filter(cd =>
        cd.HoTen?.toLowerCase().includes(search.toLowerCase()) ||
        cd.MaCuDan?.toLowerCase().includes(search.toLowerCase()) ||
        cd.CCCD?.includes(search)
    );

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div>
            <div className="page-header">
                <h1>Quản Lý Cư Dân</h1>
                <button className="btn btn-primary" onClick={openCreate}>
                    <FiPlus /> Thêm Cư Dân
                </button>
            </div>

            {/* Filter */}
            <div className="filter-bar">
                <div className="search-bar" style={{ flex: 1, maxWidth: 400 }}>
                    <FiSearch className="search-icon" />
                    <input
                        placeholder="Tìm theo tên, mã, CCCD..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã Cư Dân</th>
                            <th>Họ Tên</th>
                            <th>CCCD</th>
                            <th>Số Điện Thoại</th>
                            <th>Quê Quán</th>
                            <th>Phòng</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map((cd) => (
                            <tr key={cd.MaCuDan}>
                                <td style={{ fontWeight: 600 }}>{cd.MaCuDan}</td>
                                <td>{cd.HoTen}</td>
                                <td>{cd.CCCD}</td>
                                <td>{cd.SoDienThoai}</td>
                                <td>{cd.QueQuan}</td>
                                <td><span className="badge badge-blue">{cd.MaPhong || '—'}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button className="btn-icon" onClick={() => openEdit(cd)} title="Sửa"><FiEdit2 /></button>
                                        <button className="btn-icon" onClick={() => handleDelete(cd.MaCuDan)} title="Xóa" style={{ color: 'var(--error)' }}><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" className="empty-state">Chưa có cư dân nào</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Cập Nhật Cư Dân' : 'Thêm Cư Dân Mới'}</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-form-grid">
                                <div className="form-group">
                                    <label>Mã Cư Dân *</label>
                                    <input className="form-control" required value={form.MaCuDan} disabled={!!editingItem}
                                        onChange={(e) => setForm({ ...form, MaCuDan: e.target.value })} placeholder="VD: CD001" />
                                </div>
                                <div className="form-group">
                                    <label>Họ Tên *</label>
                                    <input className="form-control" required value={form.HoTen}
                                        onChange={(e) => setForm({ ...form, HoTen: e.target.value })} placeholder="Nguyễn Văn A" />
                                </div>
                                <div className="form-group">
                                    <label>Số CCCD</label>
                                    <input className="form-control" value={form.CCCD}
                                        onChange={(e) => setForm({ ...form, CCCD: e.target.value })} placeholder="012345678912" />
                                </div>
                                <div className="form-group">
                                    <label>Số Điện Thoại</label>
                                    <input className="form-control" value={form.SoDienThoai}
                                        onChange={(e) => setForm({ ...form, SoDienThoai: e.target.value })} placeholder="0901234567" />
                                </div>
                                <div className="form-group">
                                    <label>Quê Quán</label>
                                    <input className="form-control" value={form.QueQuan}
                                        onChange={(e) => setForm({ ...form, QueQuan: e.target.value })} placeholder="Hà Nội" />
                                </div>
                                <div className="form-group">
                                    <label>Phòng</label>
                                    <select className="form-control" value={form.MaPhong}
                                        onChange={(e) => setForm({ ...form, MaPhong: e.target.value })}>
                                        <option value="">-- Chọn phòng --</option>
                                        {phongList.map(p => (
                                            <option key={p.MaPhong} value={p.MaPhong}>{p.SoPhong} ({p.MaPhong})</option>
                                        ))}
                                    </select>
                                </div>
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

export default CuDan;
