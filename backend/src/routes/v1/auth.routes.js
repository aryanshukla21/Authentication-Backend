const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { validate, registerSchema, loginSchema } = require('../../middlewares/validate.middleware');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;