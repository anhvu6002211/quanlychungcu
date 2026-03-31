import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiLock, FiEye, FiEyeOff, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import './Login.css';

const Login = () => {
    const [TenDangNhap, setTenDangNhap] = useState('');
    const [MatKhau, setMatKhau] = useState('');
    const [hienMatKhau, setHienMatKhau] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login({ TenDangNhap, MatKhau });
            if (success) {
                navigate('/');
            } else {
                setError('Tên đăng nhập hoặc mật khẩu không chính xác');
            }
        } catch (err) {
            console.error('Login error:', err);
            const msg = err.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* --- Cột bên trái: Brand Visual --- */}
            <div className="login-visual">
                <div className="brand-section">
                    <div className="brand-logo">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13V21H5V13H19ZM12 3L22 12H19V21H18V13H12V3ZM5 12L12 5.69L19 12H5Z" /></svg>
                        STRUCTURE & SLATE
                    </div>
                    <h1 className="visual-title">Quản Lý <br />Chung Cư</h1>
                    <p className="visual-desc">
                        Hệ thống quản lý thông minh kiến tạo không gian sống hiện đại và bền vững.
                    </p>
                </div>

                <div className="visual-stats">
                    <div className="stat-item">
                        <h3>2.4k+</h3>
                        <p><FiTrendingUp /> Cư dân tin dùng</p>
                    </div>
                    <div className="stat-item">
                        <h3>99%</h3>
                        <p><FiCheckCircle /> Độ tin cậy</p>
                    </div>
                </div>
            </div>

            {/* --- Cột bên phải: Login Form --- */}
            <div className="login-form-container">
                <div className="login-form-box">
                    <div className="form-header">
                        <h1>Đăng Nhập</h1>
                        <p>Chào mừng bạn trở lại hệ thống.</p>
                    </div>

                    {error && (
                        <div className="login-error">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>Tên đăng nhập</label>
                            <div className="input-container">
                                <i><FiUser /></i>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={TenDangNhap}
                                    onChange={(e) => setTenDangNhap(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <div className="input-container">
                                <i><FiLock /></i>
                                <input
                                    type={hienMatKhau ? "text" : "password"}
                                    placeholder="Password"
                                    value={MatKhau}
                                    onChange={(e) => setMatKhau(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setHienMatKhau(!hienMatKhau)}
                                >
                                    {hienMatKhau ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <div className="input-meta">
                            <label className="remember-me">
                                <input type="checkbox" /> Ghi nhớ đăng nhập
                            </label>
                            <a href="#" className="forgot-link">Quên mật khẩu?</a>
                        </div>

                        <button
                            type="submit"
                            className="login-action-btn"
                            disabled={loading}
                        >
                            {loading ? 'Đang xác thực...' : 'ĐĂNG NHẬP'}
                        </button>

                        <div className="social-divider">Hoặc tiếp tục với</div>

                        <div className="social-btns">
                            <button type="button" className="social-btn">
                                <FcGoogle size={20} />
                                Google
                            </button>
                            <button type="button" className="social-btn">
                                <FaApple size={20} />
                                Apple ID
                            </button>
                        </div>
                    </form>

                    <div className="footer-rights">
                        © 2024 STRUCTURE & SLATE. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
