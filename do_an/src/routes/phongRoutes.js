const express = require('express');
const router = express.Router();
const PhongController = require('../controllers/phongController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', PhongController.getAll);
router.get('/:MaPhong', PhongController.getByMa);
router.get('/toanha/:MaToaNha', PhongController.getByToaNha);
router.post('/', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), PhongController.create);
router.put('/:MaPhong', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), PhongController.update);
router.delete('/:MaPhong', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), PhongController.delete);

module.exports = router;
