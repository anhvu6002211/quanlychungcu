import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheckCircle, FiImage, FiAlertCircle, FiClock, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { suCoAPI, phongAPI } from '../../services/api';

const SuCo = () => {
    const [list, setList] = useState([]);
    const [phongList, setPhongList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [filterPriority, setFilterPriority] = useState('');

    const [form, setForm] = useState({
        MaSuCo: '', id_MaPhong: '', TenSuCo: '', MoTa: '',
        NgayBaoCao: '', TrangThai: 'Chờ duyệt', NguoiXuLy: '',
        MucDoUuTien: 'Thường'
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [scRes, pRes] = await Promise.allSettled([suCoAPI.getAll(), phongAPI.getAll()]);
            if (scRes.status === 'fulfilled') setList(scRes.value.data.data || []);
            if (pRes.status === 'fulfilled') setPhongList(pRes.value.data.data || []);
        } catch (err) { console.error('Lỗi tải sự cố:', err); }
        finally { setLoading(false); }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (form[key]) formData.append(key, form[key]);
            });
            if (imageFile) {
                formData.append('AnhSuCo', imageFile);
            }

            if (editingItem) {
                await suCoAPI.update(editingItem.MaSuCo, formData);
            } else {
                await suCoAPI.create(formData);
            }
            setShowModal(false);
            setImageFile(null);
            setPreviewImage(null);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const getStatusBadge = (s) => {
        switch (s) {
            case 'Mới báo': case 'Chờ duyệt': return 'badge-red';
            case 'Đang xử lý': return 'badge-orange';
            case 'Hoàn thành': case 'Đã xử lý': return 'badge-green';
            default: return 'badge-gray';
        }
    };

    const filtered = list.filter(sc =>
        (sc.TenSuCo?.toLowerCase().includes(search.toLowerCase()) ||
            sc.id_MaPhong?.toLowerCase().includes(search.toLowerCase())) &&
        (!filterPriority || sc.MucDoUuTien === filterPriority)
    );

    const [search, setSearch] = useState('');

    if (loading) return <div className="loading-spinner"></div>;

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <div className="page-header">
                <motion.h1 variants={itemVariants}>Quản Lý Sự Cố</motion.h1>
                <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button variants={itemVariants} className="btn btn-primary" onClick={() => {
                        setEditingItem(null);
                        setForm({ MaSuCo: '', id_MaPhong: '', TenSuCo: '', MoTa: '', NgayBaoCao: new Date().toISOString().split('T')[0], TrangThai: 'Chờ duyệt', NguoiXuLy: '', MucDoUuTien: 'Thường' });
                        setImageFile(null); setPreviewImage(null);
                        setShowModal(true);
                    }} whileHover={{ scale: 1.05 }}>
                        <FiPlus /> Báo Sự Cố Mới
                    </motion.button>
                </div>
            </div>

            <motion.div className="filter-bar" variants={itemVariants}>
                <div className="search-bar" style={{ flex: 1, maxWidth: 350 }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="Tìm tên sự cố, mã phòng..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="form-control" style={{ width: 180 }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                    <option value="">Tất cả mức độ</option>
                    <option value="Thường">⚪ Thường</option>
                    <option value="Gấp">🔴 Gấp</option>
                </select>
            </motion.div>

            <motion.div className="table-container" variants={itemVariants}>
                <table>
                    <thead>
                        <tr>
                            <th>Hình Ảnh</th>
                            <th>Mã Sự Cố</th>
                            <th>Tên Sự Cố</th>
                            <th>Phòng</th>
                            <th>Ưu Tiên</th>
                            <th>Trạng Thái</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filtered.length > 0 ? filtered.map(sc => (
                                <motion.tr key={sc.MaSuCo} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <td data-label="Hình Ảnh">
                                        {sc.AnhSuCo ? (
                                            <img src={`http://localhost:3000${sc.AnhSuCo}`} alt="Sự cố" style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }} onClick={() => window.open(`http://localhost:3000${sc.AnhSuCo}`)} />
                                        ) : (
                                            <div style={{ width: 60, height: 45, background: 'var(--surface-variant)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)' }}>
                                                <FiImage size={18} />
                                            </div>
                                        )}
                                    </td>
                                    <td data-label="Mã Sự Cố" style={{ fontWeight: 600 }}>{sc.MaSuCo}</td>
                                    <td data-label="Tên Sự Cố">
                                        <div style={{ fontWeight: 600 }}>{sc.TenSuCo}</div>
                                        <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sc.MoTa}</div>
                                    </td>
                                    <td data-label="Phòng">{sc.id_MaPhong}</td>
                                    <td data-label="Ưu Tiên">
                                        <span className={`badge ${sc.MucDoUuTien === 'Gấp' ? 'badge-red' : 'badge-gray'}`}>
                                            {sc.MucDoUuTien === 'Gấp' ? '🔥 Gấp' : 'Thường'}
                                        </span>
                                    </td>
                                    <td data-label="Trạng Thái"><span className={`badge ${getStatusBadge(sc.TrangThai)}`}>{sc.TrangThai}</span></td>
                                    <td data-label="Thao Tác">
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button className="btn-icon" title="Sửa" onClick={() => {
                                                setEditingItem(sc);
                                                setForm({ ...sc, NgayBaoCao: sc.NgayBaoCao?.split('T')[0] || '' });
                                                setPreviewImage(sc.AnhSuCo ? `http://localhost:3000${sc.AnhSuCo}` : null);
                                                setShowModal(true);
                                            }}><FiEdit2 /></button>
                                            <button className="btn-icon" style={{ color: 'var(--error)' }} onClick={async () => { if (confirm('Xóa báo cáo này?')) { try { await suCoAPI.delete(sc.MaSuCo); loadData(); } catch { alert('Lỗi'); } } }}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr><td colSpan="7" className="empty-state">Hiện không có sự cố nào</td></tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </motion.div>

            {/* Modal Form */}
            <AnimatePresence>
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <motion.div className="modal" style={{ maxWidth: 650 }} onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <div className="modal-header">
                                <h2>{editingItem ? 'Chi Tiết Sự Cố' : 'Báo Sự Cố Mới'}</h2>
                                <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 20 }}>
                                    <div className="modal-form-grid">
                                        <div className="form-group"><label>Mã Sự Cố *</label><input className="form-control" required value={form.MaSuCo} disabled={!!editingItem} onChange={e => setForm({ ...form, MaSuCo: e.target.value })} placeholder="VD: SC001" /></div>
                                        <div className="form-group"><label>Phòng *</label>
                                            <select className="form-control" required value={form.id_MaPhong} onChange={e => setForm({ ...form, id_MaPhong: e.target.value })}>
                                                <option value="">-- Chọn phòng --</option>
                                                {phongList.map(p => <option key={p.MaPhong} value={p.MaPhong}>{p.SoPhong}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Tên Sự Cố *</label><input className="form-control" required value={form.TenSuCo} onChange={e => setForm({ ...form, TenSuCo: e.target.value })} placeholder="VD: Hỏng vòi nước tầng 5" /></div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Mô Tả Chi Tiết</label><textarea className="form-control" rows={3} value={form.MoTa} onChange={e => setForm({ ...form, MoTa: e.target.value })} /></div>
                                        <div className="form-group"><label>Mức độ ưu tiên</label>
                                            <select className="form-control" value={form.MucDoUuTien} onChange={e => setForm({ ...form, MucDoUuTien: e.target.value })}>
                                                <option value="Thường">Thường</option>
                                                <option value="Gấp">Gấp (Xử lý ngay)</option>
                                            </select>
                                        </div>
                                        <div className="form-group"><label>Trạng Thái</label>
                                            <select className="form-control" value={form.TrangThai} onChange={e => setForm({ ...form, TrangThai: e.target.value })}>
                                                <option value="Chờ duyệt">Chờ duyệt</option>
                                                <option value="Đang xử lý">Đang xử lý</option>
                                                <option value="Hoàn thành">Hoàn thành</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Ảnh Section */}
                                    <div style={{ textAlign: 'center' }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Ảnh sự cố</label>
                                        <div style={{
                                            width: '100%', height: 140, border: '2px dashed var(--outline-variant)',
                                            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            overflow: 'hidden', cursor: 'pointer', position: 'relative'
                                        }} onClick={() => document.getElementById('image-upload').click()}>
                                            {previewImage ? (
                                                <img src={previewImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                                            ) : (
                                                <div style={{ color: 'var(--on-surface-variant)' }}>
                                                    <FiImage size={32} />
                                                    <p style={{ fontSize: 11, marginTop: 4 }}>Nhấn để chọn ảnh</p>
                                                </div>
                                            )}
                                            <input id="image-upload" type="file" hidden accept="image/*" onChange={handleImageChange} />
                                        </div>
                                        {previewImage && <button type="button" className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 11, height: 'auto', marginTop: 8 }} onClick={() => { setPreviewImage(null); setImageFile(null); }}>Gỡ ảnh</button>}
                                    </div>
                                </div>

                                <div className="modal-footer" style={{ marginTop: 12 }}>
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                                    <button type="submit" className="btn btn-primary">{editingItem ? 'Lưu Thay Đổi' : 'Báo Sự Cố'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SuCo;
