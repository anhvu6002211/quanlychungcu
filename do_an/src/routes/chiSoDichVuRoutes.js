const express = require('express');
const router = express.Router();
const ChiSoDichVuController = require('../controllers/chiSoDichVuController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get(
    '/',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KY_THUAT),
    ChiSoDichVuController.getAll
);

router.get('/:MaGhi', authMiddleware, ChiSoDichVuController.getByMa);
router.get('/hoadon/:MaHoaDon', authMiddleware, ChiSoDichVuController.getByHoaDon);

router.post(
    '/',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KY_THUAT),
    ChiSoDichVuController.create
);

router.put(
    '/:MaGhi',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY, roleMiddleware.ROLES.KY_THUAT),
    ChiSoDichVuController.update
);

router.delete(
    '/:MaGhi',
    authMiddleware,
    roleMiddleware(roleMiddleware.ROLES.ADMIN, roleMiddleware.ROLES.BAN_QUAN_LY),
    ChiSoDichVuController.delete
);

module.exports = router;
