const express = require('express');
const router = express.Router();
const ChiSoDichVuController = require('../controllers/chiSoDichVuController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, ChiSoDichVuController.getAll);
router.get('/:MaGhi', authMiddleware, ChiSoDichVuController.getByMa);
// Xem chi tiết (danh sách chỉ số) của 1 hóa đơn
router.get('/hoadon/:MaHoaDon', authMiddleware, ChiSoDichVuController.getByHoaDon);
router.post('/', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), ChiSoDichVuController.create);
router.put('/:MaGhi', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), ChiSoDichVuController.update);
router.delete('/:MaGhi', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), ChiSoDichVuController.delete);

module.exports = router;
