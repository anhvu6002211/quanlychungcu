import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Tự động gắn Token vào mọi request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Xử lý lỗi global
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau';
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.error('Phiên làm việc hết hạn, vui lòng đăng nhập lại');
            window.location.href = '/login';
        } else {
            toast.error(message);
        }
        
        
        return Promise.reject(error);
    }
);

// === Auth ===
export const authAPI = {
    login: (data) => api.post('/nguoidung/login', data),
    getProfile: () => api.get('/nguoidung/me/profile'),
};

// === Tòa Nhà ===
export const toaNhaAPI = {
    getAll: () => api.get('/toanha'),
    getByMa: (ma) => api.get(`/toanha/${ma}`),
    create: (data) => api.post('/toanha', data),
    update: (ma, data) => api.put(`/toanha/${ma}`, data),
    delete: (ma) => api.delete(`/toanha/${ma}`),
};

// === Phòng ===
export const phongAPI = {
    getAll: () => api.get('/phong'),
    getByMa: (ma) => api.get(`/phong/${ma}`),
    create: (data) => api.post('/phong', data),
    update: (ma, data) => api.put(`/phong/${ma}`, data),
    delete: (ma) => api.delete(`/phong/${ma}`),
};

// === Cư Dân ===
export const cuDanAPI = {
    getAll: () => api.get('/cudan'),
    getByMa: (ma) => api.get(`/cudan/${ma}`),
    create: (data) => api.post('/cudan', data),
    update: (ma, data) => api.put(`/cudan/${ma}`, data),
    delete: (ma) => api.delete(`/cudan/${ma}`),
};

// === Dịch Vụ ===
export const dichVuAPI = {
    getAll: () => api.get('/danhsachdichvu'),
    getByMa: (ma) => api.get(`/danhsachdichvu/${ma}`),
    create: (data) => api.post('/danhsachdichvu', data),
    update: (ma, data) => api.put(`/danhsachdichvu/${ma}`, data),
    delete: (ma) => api.delete(`/danhsachdichvu/${ma}`),
};

// === Hóa Đơn ===
export const hoaDonAPI = {
    getAll: () => api.get('/hoadon'),
    getByMa: (ma) => api.get(`/hoadon/${ma}`),
    create: (data) => api.post('/hoadon', data),
    update: (ma, data) => api.put(`/hoadon/${ma}`, data),
    getStats: () => api.get('/hoadon/stats/revenue'),
    delete: (ma) => api.delete(`/hoadon/${ma}`),
};

// === Chỉ Số Dịch Vụ ===
export const chiSoDichVuAPI = {
    getAll: () => api.get('/chisodichvu'),
    getByMa: (ma) => api.get(`/chisodichvu/${ma}`),
    create: (data) => api.post('/chisodichvu', data),
    update: (ma, data) => api.put(`/chisodichvu/${ma}`, data),
    delete: (ma) => api.delete(`/chisodichvu/${ma}`),
};

// === Sự Cố ===
export const suCoAPI = {
    getAll: () => api.get('/suco'),
    getByMa: (ma) => api.get(`/suco/${ma}`),
    create: (formData) => api.post('/suco', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (ma, formData) => api.put(`/suco/${ma}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    xuLy: (ma, data) => api.patch(`/suco/${ma}/xuly`, data),
    delete: (ma) => api.delete(`/suco/${ma}`),
};

// === Thông Báo ===
export const thongBaoAPI = {
    getAll: () => api.get('/thongbao'),
    getByMa: (ma) => api.get(`/thongbao/${ma}`),
    create: (data) => api.post('/thongbao', data),
    update: (ma, data) => api.put(`/thongbao/${ma}`, data),
    delete: (ma) => api.delete(`/thongbao/${ma}`),
};

// === Bãi Xe ===
export const baiXeAPI = {
    getAll: () => api.get('/baixe'),
    getByMa: (ma) => api.get(`/baixe/${ma}`),
    getByCuDan: (ma) => api.get(`/baixe/cudan/${ma}`),
    create: (data) => api.post('/baixe', data),
    update: (ma, data) => api.put(`/baixe/${ma}`, data),
    calculateFee: (maPhong) => api.post(`/baixe/calculate-fee/${maPhong}`),
    delete: (ma) => api.delete(`/baixe/${ma}`),

};

// === Người Dùng ===
export const nguoiDungAPI = {
    getAll: () => api.get('/nguoidung'),
    getByMa: (ma) => api.get(`/nguoidung/${ma}`),
    create: (data) => api.post('/nguoidung/taotaikhoan', data),
    update: (ma, data) => api.put(`/nguoidung/${ma}`, data),
    delete: (ma) => api.delete(`/nguoidung/${ma}`),
};

export default api;
