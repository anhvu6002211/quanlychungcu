const express = require('express');
const router = express.Router();
const ToaNhaController = require('../controllers/toaNhaController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const validate = require('../middlewares/validateMiddleware');
const { toaNhaSchema } = require('../validations/toaNhaValidation');

router.get('/', ToaNhaController.getAll);
router.get('/:MaToaNha', ToaNhaController.getByMa);
router.post('/', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), validate(toaNhaSchema), ToaNhaController.create);
router.put('/:MaToaNha', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), validate(toaNhaSchema), ToaNhaController.update);
router.delete('/:MaToaNha', authMiddleware, roleMiddleware(roleMiddleware.ROLES.BAN_QUAN_LY), ToaNhaController.delete);

module.exports = router;
