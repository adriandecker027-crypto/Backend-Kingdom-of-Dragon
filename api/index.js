const express = require('express');
const router = express.Router();
const authController = require('../controller/auth_controller');

// Authentication routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', authController.getCurrentUser);
router.post('/auth/refresh', authController.refreshToken);

module.exports = router;
