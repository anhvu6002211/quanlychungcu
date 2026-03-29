import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiFileText, FiAlertTriangle, FiPlus, FiActivity } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
        <div>
            <div className="page-header">
                <h1>Tổng Quan</h1>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/hoa-don')}>
                        <FiFileText /> Xem Hóa Đơn
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
                <div className="stat-card blue" style={{ animationDelay: '0.1s', animation: 'fadeInUp 0.5s ease' }}>
                    <div className="stat-icon"><FiHome /></div>
                    <div className="stat-value">{stats.phong}</div>
                    <div className="stat-label">Tổng số phòng</div>
                </div>
                <div className="stat-card green" style={{ animationDelay: '0.2s', animation: 'fadeInUp 0.5s ease 0.1s both' }}>
                    <div className="stat-icon"><FiUsers /></div>
                    <div className="stat-value">{stats.cuDan}</div>
                    <div className="stat-label">Cư dân</div>
                </div>
                <div className="stat-card orange" style={{ animationDelay: '0.3s', animation: 'fadeInUp 0.5s ease 0.2s both' }}>
                    <div className="stat-icon"><FiFileText /></div>
                    <div className="stat-value">{stats.hoaDon}</div>
                    <div className="stat-label">Hóa đơn chưa thanh toán</div>
                </div>
                <div className="stat-card red" style={{ animationDelay: '0.4s', animation: 'fadeInUp 0.5s ease 0.3s both' }}>
                    <div className="stat-icon"><FiAlertTriangle /></div>
                    <div className="stat-value">{stats.suCo}</div>
                    <div className="stat-label">Sự cố đang xử lý</div>
                </div>
            </div>

            {/* Charts & Quick Actions */}
            <div className="dashboard-charts">
                <div className="chart-card">
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
                                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
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
                </div>
                <div className="chart-card">
                    <h3>⚡ Thao Tác Nhanh</h3>
                    <div className="quick-actions">
                        <button className="quick-action-btn" onClick={() => navigate('/cu-dan')}>
                            <FiPlus className="icon" />
                            <span className="text">Thêm Cư Dân</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => navigate('/hoa-don')}>
                            <FiFileText className="icon" />
                            <span className="text">Tạo Hóa Đơn</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => navigate('/su-co')}>
                            <FiAlertTriangle className="icon" />
                            <span className="text">Xem Sự Cố</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => navigate('/chi-so')}>
                            <FiActivity className="icon" />
                            <span className="text">Ghi Chỉ Số</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Invoices */}
            <div className="recent-table">
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
                            {recentHoaDon.length > 0 ? recentHoaDon.map((hd) => (
                                <tr key={hd.MaHoaDon}>
                                    <td style={{ fontWeight: 600 }}>{hd.MaHoaDon}</td>
                                    <td>{hd.id_MaPhong}</td>
                                    <td>{hd.ThangThu}</td>
                                    <td>{hd.TongTien?.toLocaleString('vi-VN')}đ</td>
                                    <td><span className={`badge ${getBadgeClass(hd.TrangThai)}`}>{hd.TrangThai}</span></td>
                                </tr>
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
            </div>
        </div>
    );
};

export default Dashboard;
