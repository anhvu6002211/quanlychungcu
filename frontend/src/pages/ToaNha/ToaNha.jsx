import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { toaNhaAPI, phongAPI } from '../../services/api';

const ToaNha = () => {
    const [toaNhaList, setToaNhaList] = useState([]);
    const [phongList, setPhongList] = useState([]);
    const [selectedToaNha, setSelectedToaNha] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('toanha'); // 'toanha' | 'phong'
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [tnRes, pRes] = await Promise.allSettled([toaNhaAPI.getAll(), phongAPI.getAll()]);
            if (tnRes.status === 'fulfilled') setToaNhaList(tnRes.value.data.data || []);
            if (pRes.status === 'fulfilled') setPhongList(pRes.value.data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const getPhongByToaNha = (maTN) => phongList.filter(p => p.MaToaNha === maTN);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đang ở': return '#1565C0';
            case 'Trống': return '#90A4AE';
            case 'Đang sửa': return '#FFA726';
            default: return '#90A4AE';
        }
    };

    const openCreateToaNha = () => {
        setModalType('toanha'); setEditingItem(null);
        setForm({ MaToaNha: '', TenToaNha: '', SoLuongPhong: 0 });
        setShowModal(true);
    };

    const openCreatePhong = () => {
        setModalType('phong'); setEditingItem(null);
        setForm({ MaPhong: '', SoPhong: '', MaToaNha: selectedToaNha || '', TrangThai: 'Trống', DienTich: '' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'toanha') {
                editingItem ? await toaNhaAPI.update(editingItem.MaToaNha, form) : await toaNhaAPI.create(form);
            } else {
                editingItem ? await phongAPI.update(editingItem.MaPhong, form) : await phongAPI.create(form);
            }
            setShowModal(false); loadData();
        } catch (err) { alert(err.response?.data?.message || 'Lỗi'); }
    };

    const handleDeleteTN = async (ma) => {
        if (!confirm('Xóa tòa nhà này?')) return;
        try { await toaNhaAPI.delete(ma); loadData(); } catch (err) { alert('Lỗi khi xóa'); }
    };

    const handleDeletePhong = async (ma) => {
        if (!confirm('Xóa phòng này?')) return;
        try { await phongAPI.delete(ma); loadData(); } catch (err) { alert('Lỗi khi xóa'); }
    };

    if (loading) return <div className="loading-spinner"></div>;

    const filteredPhong = selectedToaNha ? getPhongByToaNha(selectedToaNha) : phongList;

    return (
        <div>
            <div className="page-header">
                <h1>Quản Lý Tòa Nhà & Phòng</h1>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline" onClick={openCreateToaNha}><FiPlus /> Thêm Tòa Nhà</button>
                    <button className="btn btn-primary" onClick={openCreatePhong}><FiPlus /> Thêm Phòng</button>
                </div>
            </div>

            {/* Tòa Nhà Cards */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                {toaNhaList.map(tn => {
                    const phongTN = getPhongByToaNha(tn.MaToaNha);
                    const dangO = phongTN.filter(p => p.TrangThai === 'Đang ở').length;
                    const ratio = phongTN.length > 0 ? Math.round((dangO / phongTN.length) * 100) : 0;
                    return (
                        <div key={tn.MaToaNha} className={`card ${selectedToaNha === tn.MaToaNha ? '' : ''}`}
                            style={{ cursor: 'pointer', border: selectedToaNha === tn.MaToaNha ? '2px solid var(--primary)' : '2px solid transparent' }}
                            onClick={() => setSelectedToaNha(selectedToaNha === tn.MaToaNha ? null : tn.MaToaNha)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem' }}>{tn.TenToaNha}</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginTop: 4 }}>{tn.MaToaNha}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setEditingItem(tn); setForm({ ...tn }); setModalType('toanha'); setShowModal(true); }}><FiEdit2 size={14} /></button>
                                    <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleDeleteTN(tn.MaToaNha); }} style={{ color: 'var(--error)' }}><FiTrash2 size={14} /></button>
                                </div>
                            </div>
                            <div style={{ marginTop: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                                    <span>Phòng: {phongTN.length}</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{ratio}%</span>
                                </div>
                                <div style={{ background: 'var(--surface-container)', borderRadius: 10, height: 6 }}>
                                    <div style={{ background: 'var(--primary)', borderRadius: 10, height: '100%', width: `${ratio}%`, transition: 'width 0.5s' }}></div>
                                </div>
                                <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                                    <span>🟢 Đang ở: {dangO}</span>
                                    <span>⚪ Trống: {phongTN.filter(p => p.TrangThai === 'Trống').length}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Phòng Grid */}
            <div style={{ marginTop: 24 }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>
                    {selectedToaNha ? `Sơ đồ phòng - ${toaNhaList.find(t => t.MaToaNha === selectedToaNha)?.TenToaNha}` : 'Tất cả phòng'}
                    <span style={{ fontSize: '0.82rem', color: 'var(--on-surface-variant)', marginLeft: 8 }}>({filteredPhong.length} phòng)</span>
                </h2>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16, fontSize: '0.8rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, background: '#1565C0', borderRadius: 3 }}></span> Đang ở</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, background: '#90A4AE', borderRadius: 3 }}></span> Trống</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, background: '#FFA726', borderRadius: 3 }}></span> Đang sửa</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                    {filteredPhong.map(p => (
                        <div key={p.MaPhong} style={{
                            background: getStatusColor(p.TrangThai), color: '#fff', borderRadius: 8,
                            padding: '12px 8px', textAlign: 'center', fontSize: '0.82rem', fontWeight: 600,
                            cursor: 'pointer', transition: 'transform 0.2s', position: 'relative'
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                            {p.SoPhong}
                            <div style={{ fontSize: '0.65rem', opacity: 0.85, marginTop: 2 }}>{p.DienTich ? `${p.DienTich}m²` : ''}</div>
                            <button className="btn-icon" onClick={() => handleDeletePhong(p.MaPhong)}
                                style={{ position: 'absolute', top: 2, right: 2, color: 'rgba(255,255,255,0.7)', padding: 2 }}>
                                <FiX size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem ? 'Cập Nhật' : 'Thêm Mới'} {modalType === 'toanha' ? 'Tòa Nhà' : 'Phòng'}</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {modalType === 'toanha' ? (
                                <>
                                    <div className="form-group">
                                        <label>Mã Tòa Nhà *</label>
                                        <input className="form-control" required value={form.MaToaNha} disabled={!!editingItem}
                                            onChange={e => setForm({ ...form, MaToaNha: e.target.value })} placeholder="VD: TN01" />
                                    </div>
                                    <div className="form-group">
                                        <label>Tên Tòa Nhà *</label>
                                        <input className="form-control" required value={form.TenToaNha}
                                            onChange={e => setForm({ ...form, TenToaNha: e.target.value })} placeholder="VD: Tòa A" />
                                    </div>
                                    <div className="form-group">
                                        <label>Số Lượng Phòng</label>
                                        <input type="number" className="form-control" value={form.SoLuongPhong}
                                            onChange={e => setForm({ ...form, SoLuongPhong: parseInt(e.target.value) || 0 })} />
                                    </div>
                                </>
                            ) : (
                                <div className="modal-form-grid">
                                    <div className="form-group">
                                        <label>Mã Phòng *</label>
                                        <input className="form-control" required value={form.MaPhong} disabled={!!editingItem}
                                            onChange={e => setForm({ ...form, MaPhong: e.target.value })} placeholder="VD: P101" />
                                    </div>
                                    <div className="form-group">
                                        <label>Số Phòng *</label>
                                        <input className="form-control" required value={form.SoPhong}
                                            onChange={e => setForm({ ...form, SoPhong: e.target.value })} placeholder="VD: A-101" />
                                    </div>
                                    <div className="form-group">
                                        <label>Tòa Nhà *</label>
                                        <select className="form-control" required value={form.MaToaNha}
                                            onChange={e => setForm({ ...form, MaToaNha: e.target.value })}>
                                            <option value="">-- Chọn tòa --</option>
                                            {toaNhaList.map(tn => <option key={tn.MaToaNha} value={tn.MaToaNha}>{tn.TenToaNha}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Trạng Thái</label>
                                        <select className="form-control" value={form.TrangThai}
                                            onChange={e => setForm({ ...form, TrangThai: e.target.value })}>
                                            <option value="Trống">Trống</option>
                                            <option value="Đang ở">Đang ở</option>
                                            <option value="Đang sửa">Đang sửa</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Diện Tích (m²)</label>
                                        <input type="number" className="form-control" value={form.DienTich}
                                            onChange={e => setForm({ ...form, DienTich: parseFloat(e.target.value) || '' })} />
                                    </div>
                                </div>
                            )}
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

export default ToaNha;
