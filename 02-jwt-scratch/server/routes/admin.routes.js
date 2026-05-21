const express = require("express")
const adminController = require("../controllers/admin.controller")
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware")

const router = express.Router()

router.get("/users", requireAuth, requireAdmin, adminController.getAllUsers)

router.get("/users/:id", requireAuth, requireAdmin, adminController.getUserById)

router.put("/users/:id/role", requireAuth, requireAdmin, adminController.updateUserRole)

router.delete("/users/:id", requireAuth, requireAdmin, adminController.deleteUser)

module.exports = router;