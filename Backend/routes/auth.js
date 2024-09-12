const express = require('express');
const router = express.Router();
const { register, login, getAllUsers } = require('../controllers/authController');
const { auth, authorize } = require('../middleware/auth');



// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/users',getAllUsers)

// Protected route (dashboard)
router.get('/dashboard', auth, (req, res) => {
    res.json({ message: 'Welcome to the dashboard', user: req.user });
});

// Admin-only route
router.get('/admin', auth, authorize([1]), (req, res) => {
    res.json({ message: 'Welcome Admin' });
});

module.exports = router;
