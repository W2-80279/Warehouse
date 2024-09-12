const express = require('express');
const router = express.Router();
const { getAllRackSlots, getRackSlotById, createRackSlot, updateRackSlot, deleteRackSlot } = require('../controllers/RackSlotController');
const { auth, authorize } = require('../middleware/auth');

// Routes
router.get('/', auth, authorize([1]), getAllRackSlots); // Admin only
router.get('/:id', auth, authorize([1]), getRackSlotById); // Admin only
router.post('/', auth, authorize([1]), createRackSlot); // Admin only
router.put('/:id', auth, authorize([1]), updateRackSlot); // Admin only
router.delete('/:id', auth, authorize([1]), deleteRackSlot); // Admin only

module.exports = router;
