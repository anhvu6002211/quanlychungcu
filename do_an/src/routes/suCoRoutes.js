const express = require('express');
const router = express.Router();
const SuCoController = require('../controllers/suCoController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, SuCoController.getAll);
router.get('/:MaSuCo', authMiddleware, SuCoController.getByMa);
router.get('/trangthai/:TrangThai', authMiddleware, SuCoController.getByTrangThai);
router.get('/nguoibao/:MaNguoiBao', authMiddleware, SuCoController.getByNguoiBao);
router.get('/phong/:MaPhong', authMiddleware, SuCoController.getByPhong);
router.post('/', authMiddleware, SuCoController.create);
router.put('/:MaSuCo', authMiddleware, SuCoController.update);
router.patch('/:MaSuCo/xuly', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), SuCoController.xuLy);
router.delete('/:MaSuCo', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), SuCoController.delete);

module.exports = router;
