const express = require('express');
const userController = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

// GET user profile (protected)
router.get('/profile', requireAuth, userController.profile);

// UPDATE user profile (protected)
router.put('/profile', requireAuth, userController.updateProfile);

// CHANGE password (protected)
router.put('/change-password', requireAuth, userController.changePassword);

// DELETE account (protected)
router.delete('/profile', requireAuth, userController.deleteAccount);

module.exports = router;