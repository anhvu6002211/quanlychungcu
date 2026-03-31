const express = require('express');
const router = express.Router();
const SuCoController = require('../controllers/suCoController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get(
    '/',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KY_THUAT),
    SuCoController.getAll
);

router.get('/:MaSuCo', authMiddleware, SuCoController.getByMa);
router.get('/trangthai/:TrangThai', authMiddleware, SuCoController.getByTrangThai);
router.get('/nguoibao/:MaNguoiBao', authMiddleware, SuCoController.getByNguoiBao);
router.get('/phong/:MaPhong', authMiddleware, SuCoController.getByPhong);

router.post('/', authMiddleware, upload.single('AnhSuCo'), SuCoController.create);

router.put(
    '/:MaSuCo',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KY_THUAT),
    upload.single('AnhSuCo'),
    SuCoController.update
);

router.patch(
    '/:MaSuCo/xuly',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KY_THUAT),
    SuCoController.xuLy
);

router.delete(
    '/:MaSuCo',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    SuCoController.delete
);

module.exports = router;
