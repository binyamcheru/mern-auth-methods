const express = require('express');
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

// REGISTER user
router.post('/register', authController.register);

// LOGIN user
router.post('/login', authController.login);

// CHECK SESSION — returns current user if logged in
router.get('/me', requireAuth, authController.checkSession);

// LOGOUT user
router.post('/logout', requireAuth, authController.logout);

module.exports = router;