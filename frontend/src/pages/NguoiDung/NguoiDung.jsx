import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiShield, FiUser, FiMail } from 'react-icons/fi';
import { nguoiDungAPI } from '../../services/api';

const NguoiDung = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({ MaNguoiDung: '', TenDangNhap: '', MatKhau: '', Email: '', VaiTro: 'user' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await nguoiDungAPI.getAll();
            setList(res.data.data || []);
        } catch (err) { console.error('Lỗi tải người dùng:', err); }
        finally { setLoading(false); }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return 'badge-red';
            case 'banquanly': return 'badge-purple';
            case 'user': return 'badge-blue';
            default: return 'badge-gray';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await nguoiDungAPI.update(editingItem.MaNguoiDung, form);
            } else {
                await nguoiDungAPI.create(form);
            }
            setShowModal(false);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleDelete = async (ma) => {
        if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
        try {
            await nguoiDungAPI.delete(ma);
            loadData();
        } catch { alert('Lỗi khi xóa'); }
    };

    const filtered = list.filter(u =>
        u.TenDangNhap?.toLowerCase().includes(search.toLowerCase()) ||
        u.Email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div>
            <div className="page-header">
                <h1>Quản Lý Người Dùng & Phân Quyền</h1>
                <button className="btn btn-primary" onClick={() => { setEditingItem(null); setForm({ MaNguoiDung: '', TenDangNhap: '', MatKhau: '', Email: '', VaiTro: 'user' }); setShowModal(true); }}>
                    <FiPlus /> Tạo Tài Khoản Mới
                </button>
            </div>

            <div className="filter-bar">
                <div className="search-bar" style={{ flex: 1, maxWidth: 400 }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="Tìm theo tên đăng nhập hoặc email..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã ID</th>
                            <th>Tên Đăng Nhập</th>
                            <th>Email</th>
                            <th>Quyền Truy Cập</th>
                            <th>Trạng Thái</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(u => (
                            <tr key={u.MaNguoiDung}>
                                <td style={{ fontWeight: 600 }}>{u.MaNguoiDung}</td>
                                <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiUser size={14} color="var(--primary)" /> {u.TenDangNhap} {u.TenDangNhap === 'admin' && '⭐'}</div></td>
                                <td>{u.Email || '—'}</td>
                                <td><span className={`badge ${getRoleBadge(u.VaiTro)}`}>{u.VaiTro}</span></td>
                                <td><span className="badge badge-green">Hoạt động</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button className="btn-icon" title="Chỉnh sửa" onClick={() => { setEditingItem(u); setForm({ ...u, MatKhau: '' }); setShowModal(true); }}><FiEdit2 /></button>
                                        {u.TenDangNhap !== 'admin' && (
                                            <button className="btn-icon" style={{ color: 'var(--error)' }} onClick={() => handleDelete(u.MaNguoiDung)}><FiTrash2 /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="6" className="empty-state">Không tìm thấy người dùng nào</td></tr>}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Sửa Tài Khoản' : 'Cấp Tài Khoản Mới'}</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Mã Người Dùng (Tùy chọn)</label>
                                <input className="form-control" value={form.MaNguoiDung} disabled={!!editingItem}
                                    onChange={e => setForm({ ...form, MaNguoiDung: e.target.value })} placeholder="VD: USR-001" />
                            </div>
                            <div className="modal-form-grid">
                                <div className="form-group">
                                    <label>Tên Đăng Nhập *</label>
                                    <input className="form-control" required value={form.TenDangNhap}
                                        onChange={e => setForm({ ...form, TenDangNhap: e.target.value })} placeholder="nguyen_van_a" />
                                </div>
                                <div className="form-group">
                                    <label>Vai Trò *</label>
                                    <select className="form-control" value={form.VaiTro}
                                        onChange={e => setForm({ ...form, VaiTro: e.target.value })}>
                                        <option value="admin">Quản Trị Viên (Admin)</option>
                                        <option value="banquanly">Ban Quản Lý (BQL)</option>
                                        <option value="user">Cư Dân (User)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Mật Khẩu {editingItem ? '(Để trống nếu không đổi)' : '*'}</label>
                                <input type="password" className="form-control" required={!editingItem} value={form.MatKhau}
                                    onChange={e => setForm({ ...form, MatKhau: e.target.value })} placeholder="••••••••" />
                                {!editingItem && <small style={{ color: 'var(--on-surface-variant)', fontSize: '0.72rem' }}>Mặc định mật khẩu sẽ bằng tên đăng nhập nếu để trống.</small>}
                            </div>
                            <div className="form-group">
                                <label>Email liên hệ</label>
                                <div className="input-wrapper" style={{ position: 'relative' }}>
                                    <FiMail style={{ position: 'absolute', left: 12, top: 12, color: 'var(--on-surface-variant)' }} />
                                    <input className="form-control" style={{ paddingLeft: 38 }} value={form.Email}
                                        onChange={e => setForm({ ...form, Email: e.target.value })} placeholder="email@example.com" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">{editingItem ? 'Lưu Thay Đổi' : 'Tạo Tài Khoản'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NguoiDung;
