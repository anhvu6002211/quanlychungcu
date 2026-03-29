import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FiHome, FiUsers, FiFileText, FiTool, FiSettings,
    FiBarChart2, FiLogOut, FiLayers, FiGrid, FiClipboard,
    FiAlertTriangle, FiActivity, FiBell, FiTruck
} from 'react-icons/fi';
import './Sidebar.css';

const menuItems = [
    { label: 'QUẢN LÝ CHÍNH', type: 'label' },
    { path: '/', icon: <FiHome />, text: 'Tổng quan' },
    { path: '/toa-nha', icon: <FiLayers />, text: 'Tòa Nhà & Phòng' },
    { path: '/cu-dan', icon: <FiUsers />, text: 'Cư Dân' },

    { label: 'TÀI CHÍNH', type: 'label' },
    { path: '/dich-vu', icon: <FiGrid />, text: 'Dịch Vụ' },
    { path: '/chi-so', icon: <FiActivity />, text: 'Ghi Chỉ Số' },
    { path: '/hoa-don', icon: <FiFileText />, text: 'Hóa Đơn' },

    { label: 'VẬN HÀNH', type: 'label' },
    { path: '/bang-tin', icon: <FiBell />, text: 'Bảng Tin' },
    { path: '/bai-xe', icon: <FiTruck />, text: 'Bãi Xe' },
    { path: '/su-co', icon: <FiAlertTriangle />, text: 'Sự Cố' },
    { path: '/bao-cao', icon: <FiBarChart2 />, text: 'Báo Cáo' },

    { label: 'HỆ THỐNG', type: 'label' },
    { path: '/nguoi-dung', icon: <FiClipboard />, text: 'Người Dùng' },
    { path: '/cai-dat', icon: <FiSettings />, text: 'Cài Đặt' },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'Quản trị viên';
            case 'banquanly': return 'Ban quản lý';
            default: return 'Người dùng';
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h2>
                    <div className="logo-icon">🏢</div>
                    <div>
                        Quản Lý Chung Cư
                        <span>Hệ thống quản lý thông minh</span>
                    </div>
                </h2>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item, index) => {
                    if (item.type === 'label') {
                        return <div key={index} className="nav-label">{item.label}</div>;
                    }
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.text}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">{getInitials(user?.TenDangNhap)}</div>
                    <div className="user-details">
                        <div className="user-name">{user?.TenDangNhap || 'Admin'}</div>
                        <div className="user-role">{getRoleLabel(user?.VaiTro)}</div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
                        <FiLogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
