import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiShield, FiMoon, FiSun, FiSettings, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const CaiDat = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({ TenDangNhap: '', VaiTro: '', Email: '' });
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [form, setForm] = useState({ currentPass: '', newPass: '', confirmPass: '' });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) setProfile({ ...user });
        document.documentElement.setAttribute('data-theme', theme);
    }, [user, theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (form.newPass !== form.confirmPass) {
            setError('Mật khẩu mới không trùng khớp');
            return;
        }

        // Gọi API cập nhật (cần viết method này sau trong api.js nếu muốn thực hiện thực tế)
        setSuccess(true);
        setForm({ currentPass: '', newPass: '', confirmPass: '' });
    };

    return (
        <div>
            <div className="page-header">
                <h1>Cài Đặt Hệ Thống</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                {/* User Profile */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, borderBottom: '1px solid var(--outline-variant)', paddingBottom: 16 }}>
                        <div className="user-avatar" style={{ width: 64, height: 64, fontSize: '1.5rem' }}>{user?.TenDangNhap?.charAt(0).toUpperCase()}</div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem' }}>{user?.TenDangNhap}</h3>
                            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.82rem' }}>Vai trò: <span className="badge badge-blue">{user?.VaiTro}</span></p>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email liên kết</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--on-surface)' }}>
                            <FiMail /> {user?.Email || 'Chưa cập nhật'}
                        </div>
                    </div>

                    <div style={{ marginTop: 24 }}>
                        <h4 style={{ marginBottom: 12 }}>Giao diện mặc định</h4>
                        <button className="btn btn-outline" onClick={toggleTheme} style={{ width: '100%', justifyContent: 'center' }}>
                            {theme === 'light' ? <><FiMoon /> Chế độ Tối (Dark Mode)</> : <><FiSun /> Chế độ Sáng (Light Mode)</>}
                        </button>
                    </div>
                </div>

                {/* Password Change */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <FiShield size={22} color="var(--primary)" />
                        <h3>Đổi Mật Khẩu</h3>
                    </div>

                    {success && <div className="badge badge-green" style={{ width: '100%', padding: '10px', marginBottom: 16 }}><FiCheckCircle /> Đã cập nhật mật khẩu thành công!</div>}
                    {error && <div className="badge badge-red" style={{ width: '100%', padding: '10px', marginBottom: 16 }}>{error}</div>}

                    <form onSubmit={handleUpdatePassword}>
                        <div className="form-group">
                            <label>Mật khẩu hiện tại</label>
                            <input type="password" required className="form-control" value={form.currentPass} onChange={e => setForm({ ...form, currentPass: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu mới</label>
                            <input type="password" required className="form-control" value={form.newPass} onChange={e => setForm({ ...form, newPass: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Xác nhận mật khẩu mới</label>
                            <input type="password" required className="form-control" value={form.confirmPass} onChange={e => setForm({ ...form, confirmPass: e.target.value })} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Lưu Thay Đổi</button>
                    </form>
                </div>
            </div>

            <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <FiSettings size={22} color="var(--on-surface-variant)" />
                    <h3>Thông tin ứng dụng</h3>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
                    <p>Phiên bản: 1.0.0 (Beta)</p>
                    <p>Hệ quản trị: MySQL 8.0</p>
                    <p>Đơn vị phát triển: Đồ Án Quản Lý Chung Cư 2026</p>
                </div>
            </div >
        </div >
    );
};

export default CaiDat;
