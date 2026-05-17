const express = require('express');
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

// REGISTER user
router.post('/register', authController.register);

// LOGIN user
router.post('/login', authController.login);

// GET CSRF TOKEN — needed for POST/PUT/DELETE requests
router.get('/csrf-token', (req, res) => {
  const generateToken = req.app.get('csrfGenerateToken');
  res.json({ csrfToken: generateToken(req, res) });
});

// CHECK SESSION — returns current user if logged in
router.get('/me', requireAuth, authController.checkSession);

// LOGOUT user
router.post('/logout', requireAuth, authController.logout);

module.exports = router;