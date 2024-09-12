const express = require('express');
const router = express.Router();
const { getAllRacks, getRackById, createRack, updateRack, deleteRack } = require('../controllers/RackController');
const { auth, authorize } = require('../middleware/auth');

// Routes
router.get('/', auth, authorize([1]), getAllRacks); // Admin only
router.get('/:id', auth, authorize([1]), getRackById); // Admin only
router.post('/', auth, authorize([1]), createRack); // Admin only
router.put('/:id', auth, authorize([1]), updateRack); // Admin only
router.delete('/:id', auth, authorize([1]), deleteRack); // Admin only

module.exports = router;
