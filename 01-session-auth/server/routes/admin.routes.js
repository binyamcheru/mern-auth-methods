const express = require('express');
const adminController = require('../controllers/admin.controller');
const { requireAdmin } = require('../middleware/requireAuth');

const router = express.Router();

// GET all users (admin only)
router.get('/users', requireAdmin, adminController.getAllUsers);

// GET user by ID (admin only)
router.get('/users/:id', requireAdmin, adminController.getUserById);

// UPDATE user role (admin only)
router.put('/users/:id/role', requireAdmin, adminController.updateUserRole);

// DELETE user (admin only)
router.delete('/users/:id', requireAdmin, adminController.deleteUser);

module.exports = router;
