const express = require('express');

const router = express.Router();

// GET user profile
router.get('/profile', (req, res) => {
    console.log("Get User Profile")
})

module.exports = router;