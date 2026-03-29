// Middleware phân quyền (Kiểm tra role: Ban quản lý / Cư dân)

const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // req.user được gán từ authMiddleware sau khi verify token
            // VaiTro được lưu trong token
            const userRole = req.user?.VaiTro;

            if (!userRole) {
                return res.status(403).json({
                    success: false,
                    message: 'Không có quyền truy cập'
                });
            }

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: 'Bạn không có quyền thực hiện chức năng này'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi phân quyền'
            });
        }
    };
};

// Định nghĩa các role theo database schema
const ROLES = {
    ADMIN: 'admin',
    BAN_QUAN_LY: 'banquanly',
    USER: 'user'
};

// Export cả function và ROLES để sử dụng
roleMiddleware.ROLES = ROLES;

module.exports = roleMiddleware;
