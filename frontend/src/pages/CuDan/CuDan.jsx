import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiDownload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { cuDanAPI, phongAPI } from '../../services/api';
import exportToExcel from '../../utils/exportExcel';

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

    const handleExport = () => {
        const exportData = filtered.map(cd => ({
            'Mã Cư Dân': cd.MaCuDan,
            'Họ Tên': cd.HoTen,
            'Số CCCD': cd.CCCD,
            'Điện Thoại': cd.SoDienThoai,
            'Quê Quán': cd.QueQuan,
            'Phòng': cd.MaPhong || 'Chưa nhận'
        }));
        exportToExcel(exportData, `Danh_Sach_Cu_Dan_${new Date().toLocaleDateString()}`);
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
            if (editingItem) await cuDanAPI.update(editingItem.MaCuDan, form);
            else await cuDanAPI.create(form);
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

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <div className="page-header">
                <motion.h1 variants={itemVariants}>Quản Lý Cư Dân</motion.h1>
                <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button variants={itemVariants} className="btn btn-ghost" onClick={handleExport} whileHover={{ scale: 1.05 }}>
                        <FiDownload /> Xuất Danh Sách
                    </motion.button>
                    <motion.button variants={itemVariants} className="btn btn-primary" onClick={openCreate} whileHover={{ scale: 1.05 }}>
                        <FiPlus /> Thêm Cư Dân
                    </motion.button>
                </div>
            </div>

            <motion.div className="filter-bar" variants={itemVariants}>
                <div className="search-bar" style={{ flex: 1, maxWidth: 400 }}>
                    <FiSearch className="search-icon" />
                    <input placeholder="Tìm theo tên, mã, CCCD..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </motion.div>

            <motion.div className="table-container" variants={itemVariants}>
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
                        <AnimatePresence>
                            {filtered.length > 0 ? filtered.map((cd) => (
                                <motion.tr key={cd.MaCuDan} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <td data-label="Mã Cư Dân" style={{ fontWeight: 600 }}>{cd.MaCuDan}</td>
                                    <td data-label="Họ Tên">{cd.HoTen}</td>
                                    <td data-label="CCCD">{cd.CCCD}</td>
                                    <td data-label="Số Điện Thoại">{cd.SoDienThoai}</td>
                                    <td data-label="Quê Quán">{cd.QueQuan}</td>
                                    <td data-label="Phòng"><span className="badge badge-blue">{cd.MaPhong || '—'}</span></td>
                                    <td data-label="Thao Tác">
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button className="btn-icon" onClick={() => openEdit(cd)} title="Sửa"><FiEdit2 /></button>
                                            <button className="btn-icon" onClick={() => handleDelete(cd.MaCuDan)} title="Xóa" style={{ color: 'var(--error)' }}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr><td colSpan="7" className="empty-state">Chưa có cư dân nào</td></tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <motion.div className="modal" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <div className="modal-header">
                                <h2>{editingItem ? 'Cập Nhật Cư Dân' : 'Thêm Cư Dân Mới'}</h2>
                                <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-form-grid">
                                    <div className="form-group"><label>Mã Cư Dân *</label><input className="form-control" required value={form.MaCuDan} disabled={!!editingItem} onChange={(e) => setForm({ ...form, MaCuDan: e.target.value })} placeholder="VD: CD001" /></div>
                                    <div className="form-group"><label>Họ Tên *</label><input className="form-control" required value={form.HoTen} onChange={(e) => setForm({ ...form, HoTen: e.target.value })} placeholder="Nguyễn Văn A" /></div>
                                    <div className="form-group"><label>Số CCCD</label><input className="form-control" value={form.CCCD} onChange={(e) => setForm({ ...form, CCCD: e.target.value })} placeholder="012345678912" /></div>
                                    <div className="form-group"><label>Số Điện Thoại</label><input className="form-control" value={form.SoDienThoai} onChange={(e) => setForm({ ...form, SoDienThoai: e.target.value })} placeholder="0901234567" /></div>
                                    <div className="form-group"><label>Quê Quán</label><input className="form-control" value={form.QueQuan} onChange={(e) => setForm({ ...form, QueQuan: e.target.value })} placeholder="Hà Nội" /></div>
                                    <div className="form-group"><label>Phòng</label>
                                        <select className="form-control" value={form.MaPhong} onChange={(e) => setForm({ ...form, MaPhong: e.target.value })}>
                                            <option value="">-- Chọn phòng --</option>
                                            {phongList.map(p => <option key={p.MaPhong} value={p.MaPhong}>{p.SoPhong} ({p.MaPhong})</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                                    <button type="submit" className="btn btn-primary">{editingItem ? 'Cập Nhật' : 'Lưu Dữ Liệu'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CuDan;
