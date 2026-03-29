import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import './Login.css';

const Login = () => {
    const [form, setForm] = useState({ TenDangNhap: '', MatKhau: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Nếu đã đăng nhập rồi thì vào thẳng Dashboard
    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.TenDangNhap || !form.MatKhau) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            await login(form);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Lỗi kết nối Server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-brand">
                <div className="login-brand-content">
                    <div className="login-logo">🏢</div>
                    <h1>Quản Lý Chung Cư</h1>
                    <p>Hệ thống vận hành thông minh & Tiện ích</p>
                    <div className="brand-features">
                        <span>✦ Quản lý cư dân</span>
                        <span>✦ Hóa đơn tự động</span>
                        <span>✦ Giám sát sự cố</span>
                    </div>
                </div>
            </div>

            <div className="login-form-side">
                <div className="login-form-container">
                    <div className="login-header">
                        <h2>Xin chào trở lại!</h2>
                        <p className="subtitle">Vui lòng đăng nhập để bắt đầu phiên làm việc</p>
                    </div>

                    {error && (
                        <div className="login-error">
                            <FiAlertCircle /> <span>{error}</span>
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tên đăng nhập</label>
                            <div className="input-wrapper">
                                <FiUser className="input-icon" />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tài khoản"
                                    value={form.TenDangNhap}
                                    onChange={(e) => setForm({ ...form, TenDangNhap: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    placeholder="Nhập mật khẩu"
                                    value={form.MatKhau}
                                    onChange={(e) => setForm({ ...form, MatKhau: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>© 2026 Quản Lý Chung Cư. Phiên bản 2.0.0</p>
                        <small>Debug mode: Tài khoản mật khẩu <b>admin</b></small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
