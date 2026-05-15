const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// REGISTER user
router.post('/register', authController.register);

// LOGIN user
router.post('/login', authController.login);

// LOGOUT user
router.post('/logout', authController.logout);
module.exports = router;