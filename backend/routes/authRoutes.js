const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes de autenticação
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.get('/refresh', authController.refreshToken);

module.exports = router;
