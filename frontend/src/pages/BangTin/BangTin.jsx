import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiBell, FiX, FiInfo } from 'react-icons/fi';
import { thongBaoAPI } from '../../services/api';
import './BangTin.css';
import { useAuth } from '../../context/AuthContext';

const BangTin = () => {
    const { user } = useAuth();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ MaThongBao: '', TieuDe: '', NoiDung: '', LoaiThongBao: 'Khác' });

    const isBQL = user?.VaiTro === 'admin' || user?.VaiTro === 'banquanly';

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await thongBaoAPI.getAll();
            setList(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await thongBaoAPI.create(form);
            setShowModal(false);
            setForm({ MaThongBao: '', TieuDe: '', NoiDung: '', LoaiThongBao: 'Khác' });
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi đăng tin');
        }
    };

    const handleDelete = async (ma) => {
        if (!confirm('Xóa thông báo này?')) return;
        try {
            await thongBaoAPI.delete(ma);
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Điện/Nước': return '#f59e0b';
            case 'Phí': return '#ef4444';
            case 'Họp': return '#3b82f6';
            default: return '#10b981';
        }
    };

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <div className="bang-tin-container">
            <div className="page-header">
                <h1>Bảng Tin Chung Cư</h1>
                {isBQL && (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <FiPlus /> Đăng Thông Báo
                    </button>
                )}
            </div>

            <div className="news-list">
                {list.length > 0 ? list.map((item) => (
                    <div key={item.MaThongBao} className="news-card">
                        <div className="news-tag" style={{ backgroundColor: getTypeColor(item.LoaiThongBao) }}>
                            {item.LoaiThongBao}
                        </div>
                        <div className="news-header">
                            <h3>{item.TieuDe}</h3>
                            <span className="news-date">{new Date(item.NgayDang).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <p className="news-content">{item.NoiDung}</p>
                        <div className="news-footer">
                            <span className="news-author"><FiInfo /> Đăng bởi: {item.TenNguoiDang || 'Ban Quản Lý'}</span>
                            {isBQL && (
                                <button className="btn-icon" onClick={() => handleDelete(item.MaThongBao)} style={{ color: 'var(--error)' }}>
                                    <FiTrash2 />
                                </button>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="empty-state">Hiện không có thông báo nào mới.</div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Đăng Thông Báo Mới</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Mã Thông Báo *</label>
                                <input className="form-control" required value={form.MaThongBao}
                                    onChange={(e) => setForm({ ...form, MaThongBao: e.target.value })} placeholder="VD: TB001" />
                            </div>
                            <div className="form-group">
                                <label>Tiêu Đề *</label>
                                <input className="form-control" required value={form.TieuDe}
                                    onChange={(e) => setForm({ ...form, TieuDe: e.target.value })} placeholder="Cắt điện định kỳ..." />
                            </div>
                            <div className="form-group">
                                <label>Loại Thông Báo</label>
                                <select className="form-control" value={form.LoaiThongBao}
                                    onChange={(e) => setForm({ ...form, LoaiThongBao: e.target.value })}>
                                    <option value="Khác">Khác</option>
                                    <option value="Điện/Nước">Điện/Nước</option>
                                    <option value="Phí">Phí</option>
                                    <option value="Họp">Họp</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Nội Dung</label>
                                <textarea className="form-control" rows="5" value={form.NoiDung}
                                    onChange={(e) => setForm({ ...form, NoiDung: e.target.value })} placeholder="Mô tả chi tiết nội dung thông báo..."></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">Đăng Tin</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BangTin;
