const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, googleLogin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;