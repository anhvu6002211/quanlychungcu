import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiFileText, FiAlertTriangle, FiPlus, FiActivity } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { phongAPI, cuDanAPI, hoaDonAPI, suCoAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({ phong: 0, cuDan: 0, hoaDon: 0, suCo: 0 });
    const [revenueData, setRevenueData] = useState([]);
    const [recentHoaDon, setRecentHoaDon] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [phongRes, cuDanRes, hoaDonRes, suCoRes, revenueRes] = await Promise.allSettled([
                phongAPI.getAll(),
                cuDanAPI.getAll(),
                hoaDonAPI.getAll(),
                suCoAPI.getAll(),
                hoaDonAPI.getStats(),
            ]);

            const phongData = phongRes.status === 'fulfilled' ? phongRes.value.data.data : [];
            const cuDanData = cuDanRes.status === 'fulfilled' ? cuDanRes.value.data.data : [];
            const hoaDonData = hoaDonRes.status === 'fulfilled' ? hoaDonRes.value.data.data : [];
            const suCoData = suCoRes.status === 'fulfilled' ? suCoRes.value.data.data : [];
            const revenueStats = revenueRes.status === 'fulfilled' ? revenueRes.value.data.data : [];

            setStats({
                phong: Array.isArray(phongData) ? phongData.length : 0,
                cuDan: Array.isArray(cuDanData) ? cuDanData.length : 0,
                hoaDon: Array.isArray(hoaDonData) ? hoaDonData.filter(h => h.TrangThai === 'Chưa thanh toán').length : 0,
                suCo: Array.isArray(suCoData) ? suCoData.filter(s => s.TrangThai !== 'Đã xử lý').length : 0,
            });

            setRecentHoaDon(Array.isArray(hoaDonData) ? hoaDonData.slice(0, 5) : []);
            setRevenueData(Array.isArray(revenueStats) ? revenueStats : []);
        } catch (err) {
            console.error('Lỗi tải dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    const getBadgeClass = (status) => {
        switch (status) {
            case 'Đã thanh toán': return 'badge-green';
            case 'Chưa thanh toán': return 'badge-orange';
            case 'Quá hạn': return 'badge-red';
            default: return 'badge-gray';
        }
    };

    if (loading) return <div className="loading-spinner"></div>;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div className="page-header" variants={itemVariants}>
                <h1>Tổng Quan</h1>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary"
                        onClick={() => navigate('/hoa-don')}
                    >
                        <FiFileText /> Xem Hóa Đơn
                    </motion.button>
                </div>
            </motion.div>

            {/* Stat Cards */}
            <div className="stats-grid">
                {[
                    { key: 'phong', label: 'Tổng số phòng', color: 'blue', icon: <FiHome />, value: stats.phong },
                    { key: 'cuDan', label: 'Cư dân', color: 'green', icon: <FiUsers />, value: stats.cuDan },
                    { key: 'hoaDon', label: 'Hóa đơn chưa thanh toán', color: 'orange', icon: <FiFileText />, value: stats.hoaDon },
                    { key: 'suCo', label: 'Sự cố đang xử lý', color: 'red', icon: <FiAlertTriangle />, value: stats.suCo },
                ].map((stat) => (
                    <motion.div
                        key={stat.key}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, translateY: -5 }}
                        className={`stat-card ${stat.color}`}
                    >
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Charts & Quick Actions */}
            <div className="dashboard-charts">
                <motion.div className="chart-card" variants={itemVariants} whileHover={{ boxShadow: 'var(--shadow-lg)' }}>
                    <h3>📊 Doanh Thu Theo Tháng</h3>
                    <div className="chart-wrapper" style={{ height: 250, width: '100%' }}>
                        {revenueData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--on-surface-variant)' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--on-surface-variant)' }} tickFormatter={(val) => `${val / 1000000}M`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--surface-container-high)', borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                                        formatter={(value) => [`${value.toLocaleString()}đ`, 'Doanh thu']}
                                    />
                                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]} animationDuration={1500}>
                                        {revenueData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="chart-placeholder">
                                <FiActivity size={32} style={{ marginRight: 8, opacity: 0.4 }} />
                                Chưa có dữ liệu doanh thu
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div className="chart-card" variants={itemVariants} whileHover={{ boxShadow: 'var(--shadow-lg)' }}>
                    <h3>⚡ Thao Tác Nhanh</h3>
                    <div className="quick-actions">
                        {[
                            { path: '/cu-dan', icon: <FiPlus />, text: 'Thêm Cư Dân' },
                            { path: '/hoa-don', icon: <FiFileText />, text: 'Tạo Hóa Đơn' },
                            { path: '/su-co', icon: <FiAlertTriangle />, text: 'Xem Sự Cố' },
                            { path: '/chi-so', icon: <FiActivity />, text: 'Ghi Chỉ Số' },
                        ].map((action, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05, backgroundColor: 'var(--surface-container-highest)' }}
                                whileTap={{ scale: 0.95 }}
                                className="quick-action-btn"
                                onClick={() => navigate(action.path)}
                            >
                                <span className="icon">{action.icon}</span>
                                <span className="text">{action.text}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Invoices */}
            <motion.div className="recent-table" variants={itemVariants}>
                <div className="table-container">
                    <div className="table-header">
                        <h3>Hóa đơn gần đây</h3>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/hoa-don')}>
                            Xem tất cả →
                        </button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Mã HĐ</th>
                                <th>Phòng</th>
                                <th>Tháng</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentHoaDon.length > 0 ? recentHoaDon.map((hd, idx) => (
                                <motion.tr
                                    key={hd.MaHoaDon}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.1 }}
                                >
                                    <td style={{ fontWeight: 600 }}>{hd.MaHoaDon}</td>
                                    <td>{hd.id_MaPhong}</td>
                                    <td>{hd.ThangThu}</td>
                                    <td>{hd.TongTien?.toLocaleString('vi-VN')}đ</td>
                                    <td><span className={`badge ${getBadgeClass(hd.TrangThai)}`}>{hd.TrangThai}</span></td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--on-surface-variant)' }}>
                                        Chưa có hóa đơn nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
