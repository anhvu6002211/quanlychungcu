import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheckCircle, FiImage, FiAlertCircle, FiClock, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
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
        NgayBaoCao: '', TrangThai: 'Ch\u1edd duy\u1ec7t', NguoiXuLy: '',
        MucDoUuTien: 'Th\u01b0\u1eddng'
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [scRes, pRes] = await Promise.allSettled([suCoAPI.getAll(), phongAPI.getAll()]);
            if (scRes.status === 'fulfilled') setList(scRes.value.data.data || []);
            if (pRes.status === 'fulfilled') setPhongList(pRes.value.data.data || []);
        } catch (err) {  }
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
            toast.success(`${editingItem ? 'C\u1eadp nh\u1eadt' : 'B\u00e1o'} s\u1ef1 c\u1ed1 th\u00e0nh c\u00f4ng`);
            setShowModal(false);
            setImageFile(null);
            setPreviewImage(null);
            loadData();
        } catch (err) {
            // Error handled by api.js interceptor
        }
    };

    const getStatusBadge = (s) => {
        switch (s) {
            case 'M\u1edbi b\u00e1o': case 'Ch\u1edd duy\u1ec7t': return 'badge-red';
            case '\u0110ang x\u1eed l\u00fd': return 'badge-orange';
            case 'Ho\u00e0n th\u00e0nh': case '\u0110\u00e3 x\u1eed l\u00fd': return 'badge-green';
            default: return 'badge-gray';
        }
    };

    const [search, setSearch] = useState('');

    const filtered = list.filter(sc =>
        (sc.TenSuCo?.toLowerCase().includes(search.toLowerCase()) ||
            sc.id_MaPhong?.toLowerCase().includes(search.toLowerCase())) &&
        (!filterPriority || sc.MucDoUuTien === filterPriority)
    );

    if (loading) return <div className="loading-spinner"></div>;

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <div className="page-header">
                <motion.h1 variants={itemVariants}>Qu\u1ea3n L\u00fd S\u1ef1 C\u1ed1</motion.h1>
                <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button variants={itemVariants} className="btn btn-primary" onClick={() => {
                        setEditingItem(null);
                        setForm({ MaSuCo: '', id_MaPhong: '', TenSuCo: '', MoTa: '', NgayBaoCao: new Date().toISOString().split('T')[0], TrangThai: 'Ch\u1edd duy\u1ec7t', NguoiXuLy: '', MucDoUuTien: 'Th\u01b0\u1eddng' });
                        setImageFile(null); setPreviewImage(null);
                        setShowModal(true);
                    }} whileHover={{ scale: 1.05 }}>
                        <FiPlus /> B\u00e1o S\u1ef1 C\u1ed1 M\u1edbi
                    </motion.button>
                </div>
            </div>

            <motion.div className="filter-bar" variants={itemVariants}>
                <div className="search-bar" style={{ flex: 1, maxWidth: 350 }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="T\u00ecm t\u00ean s\u1ef1 c\u1ed1, m\u00e3 ph\u00f2ng..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="form-control" style={{ width: 180 }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                    <option value="">T\u1ea5t c\u1ea3 m\u1ee9c \u0111\u1ed9</option>
                    <option value="Th\u01b0\u1eddng">\u26aa Th\u01b0\u1eddng</option>
                    <option value="G\u1ea5p">\ud83d\udd34 G\u1ea5p</option>
                </select>
            </motion.div>

            <motion.div className="table-container" variants={itemVariants}>
                <table>
                    <thead>
                        <tr>
                            <th>H\u00ecnh \u1ea2nh</th>
                            <th>M\u00e3 S\u1ef1 C\u1ed1</th>
                            <th>T\u00ean S\u1ef1 C\u1ed1</th>
                            <th>Ph\u00f2ng</th>
                            <th>\u01afu Ti\u00ean</th>
                            <th>Tr\u1ea1ng Th\u00e1i</th>
                            <th>Thao T\u00e1c</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filtered.length > 0 ? filtered.map(sc => (
                                <motion.tr key={sc.MaSuCo} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <td data-label="H\u00ecnh \u1ea2nh">
                                        {sc.AnhSuCo ? (
                                            <img src={`http://localhost:3000${sc.AnhSuCo}`} alt="S\u1ef1 c\u1ed1" style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }} onClick={() => window.open(`http://localhost:3000${sc.AnhSuCo}`)} />
                                        ) : (
                                            <div style={{ width: 60, height: 45, background: 'var(--surface-variant)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)' }}>
                                                <FiImage size={18} />
                                            </div>
                                        )}
                                    </td>
                                    <td data-label="M\u00e3 S\u1ef1 C\u1ed1" style={{ fontWeight: 600 }}>{sc.MaSuCo}</td>
                                    <td data-label="T\u00ean S\u1ef1 C\u1ed1">
                                        <div style={{ fontWeight: 600 }}>{sc.TenSuCo}</div>
                                        <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sc.MoTa}</div>
                                    </td>
                                    <td data-label="Ph\u00f2ng">{sc.id_MaPhong}</td>
                                    <td data-label="\u01afu Ti\u00ean">
                                        <span className={`badge ${sc.MucDoUuTien === 'G\u1ea5p' ? 'badge-red' : 'badge-gray'}`}>
                                            {sc.MucDoUuTien === 'G\u1ea5p' ? '\ud83d\udd25 G\u1ea5p' : 'Th\u01b0\u1eddng'}
                                        </span>
                                    </td>
                                    <td data-label="Tr\u1ea1ng Th\u00e1i"><span className={`badge ${getStatusBadge(sc.TrangThai)}`}>{sc.TrangThai}</span></td>
                                    <td data-label="Thao T\u00e1c">
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button className="btn-icon" title="S\u1eeda" onClick={() => {
                                                setEditingItem(sc);
                                                setForm({ ...sc, NgayBaoCao: sc.NgayBaoCao?.split('T')[0] || '' });
                                                setPreviewImage(sc.AnhSuCo ? `http://localhost:3000${sc.AnhSuCo}` : null);
                                                setShowModal(true);
                                            }}><FiEdit2 /></button>
                                            <button className="btn-icon" style={{ color: 'var(--error)' }} onClick={async () => { if (confirm('X\u00f3a b\u00e1o c\u00e1o n\u00e0y?')) { try { await suCoAPI.delete(sc.MaSuCo); toast.success('X\u00f3a th\u00e0nh c\u00f4ng'); loadData(); } catch { /* Error handled */ } } }}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr><td colSpan="7" className="empty-state">Hi\u1ec7n kh\u00f4ng c\u00f3 s\u1ef1 c\u1ed1 n\u00e0o</td></tr>
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
                                <h2>{editingItem ? 'Chi Ti\u1ebft S\u1ef1 C\u1ed1' : 'B\u00e1o S\u1ef1 C\u1ed1 M\u1edbi'}</h2>
                                <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 20 }}>
                                    <div className="modal-form-grid">
                                        <div className="form-group"><label>M\u00e3 S\u1ef1 C\u1ed1 *</label><input className="form-control" required value={form.MaSuCo} disabled={!!editingItem} onChange={e => setForm({ ...form, MaSuCo: e.target.value })} placeholder="VD: SC001" /></div>
                                        <div className="form-group"><label>Ph\u00f2ng *</label>
                                            <select className="form-control" required value={form.id_MaPhong} onChange={e => setForm({ ...form, id_MaPhong: e.target.value })}>
                                                <option value="">-- Ch\u1ecdn ph\u00f2ng --</option>
                                                {phongList.map(p => <option key={p.MaPhong} value={p.MaPhong}>{p.SoPhong}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}><label>T\u00ean S\u1ef1 C\u1ed1 *</label><input className="form-control" required value={form.TenSuCo} onChange={e => setForm({ ...form, TenSuCo: e.target.value })} placeholder="VD: H\u1ecfng v\u00f2i n\u01b0\u1edbc t\u1ea7ng 5" /></div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}><label>M\u00f4 T\u1ea3 Chi Ti\u1ebft</label><textarea className="form-control" rows={3} value={form.MoTa} onChange={e => setForm({ ...form, MoTa: e.target.value })} /></div>
                                        <div className="form-group"><label>M\u1ee9c \u0111\u1ed9 \u01b0u ti\u00ean</label>
                                            <select className="form-control" value={form.MucDoUuTien} onChange={e => setForm({ ...form, MucDoUuTien: e.target.value })}>
                                                <option value="Th\u01b0\u1eddng">Th\u01b0\u1eddng</option>
                                                <option value="G\u1ea5p">G\u1ea5p (X\u1eed l\u00fd ngay)</option>
                                            </select>
                                        </div>
                                        <div className="form-group"><label>Tr\u1ea1ng Th\u00e1i</label>
                                            <select className="form-control" value={form.TrangThai} onChange={e => setForm({ ...form, TrangThai: e.target.value })}>
                                                <option value="Ch\u1edd duy\u1ec7t">Ch\u1edd duy\u1ec7t</option>
                                                <option value="\u0110ang x\u1eed l\u00fd">\u0110ang x\u1eed l\u00fd</option>
                                                <option value="Ho\u00e0n th\u00e0nh">Ho\u00e0n th\u00e0nh</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* \u1ea2nh Section */}
                                    <div style={{ textAlign: 'center' }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>\u1ea2nh s\u1ef1 c\u1ed1</label>
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
                                                    <p style={{ fontSize: 11, marginTop: 4 }}>Nh\u1ea5n \u0111\u1ec3 ch\u1ecdn \u1ea3nh</p>
                                                </div>
                                            )}
                                            <input id="image-upload" type="file" hidden accept="image/*" onChange={handleImageChange} />
                                        </div>
                                        {previewImage && <button type="button" className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 11, height: 'auto', marginTop: 8 }} onClick={() => { setPreviewImage(null); setImageFile(null); }}>G\u1ee1 \u1ea3nh</button>}
                                    </div>
                                </div>

                                <div className="modal-footer" style={{ marginTop: 12 }}>
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>H\u1ee7y</button>
                                    <button type="submit" className="btn btn-primary">{editingItem ? 'L\u01b0u Thay \u0110\u1ed5i' : 'B\u00e1o S\u1ef1 C\u1ed1'}</button>
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
