import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Sidebar from './components/Sidebar/Sidebar';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import ToaNha from './pages/ToaNha/ToaNha';
import CuDan from './pages/CuDan/CuDan';
import DichVu from './pages/DichVu/DichVu';
import ChiSoDichVu from './pages/ChiSoDichVu/ChiSoDichVu';
import HoaDon from './pages/HoaDon/HoaDon';
import SuCo from './pages/SuCo/SuCo';
import NguoiDung from './pages/NguoiDung/NguoiDung';
import CaiDat from './pages/CaiDat/CaiDat';
import BangTin from './pages/BangTin/BangTin';
import BaiXe from './pages/BaiXe/BaiXe';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-spinner"></div>;
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/toa-nha" element={<ProtectedRoute><ToaNha /></ProtectedRoute>} />
          <Route path="/cu-dan" element={<ProtectedRoute><CuDan /></ProtectedRoute>} />
          <Route path="/dich-vu" element={<ProtectedRoute><DichVu /></ProtectedRoute>} />
          <Route path="/chi-so" element={<ProtectedRoute><ChiSoDichVu /></ProtectedRoute>} />
          <Route path="/hoa-don" element={<ProtectedRoute><HoaDon /></ProtectedRoute>} />
          <Route path="/su-co" element={<ProtectedRoute><SuCo /></ProtectedRoute>} />
          <Route path="/nguoi-dung" element={<ProtectedRoute><NguoiDung /></ProtectedRoute>} />
          <Route path="/bang-tin" element={<ProtectedRoute><BangTin /></ProtectedRoute>} />
          <Route path="/bai-xe" element={<ProtectedRoute><BaiXe /></ProtectedRoute>} />
          <Route path="/cai-dat" element={<ProtectedRoute><CaiDat /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
