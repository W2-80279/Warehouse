const express = require('express');
const router = express.Router();
const { getAllRackItems, getRackItemById, createRackItem, updateRackItem, deleteRackItem, insertItemIntoSlot } = require('../controllers/RackItemController');
const { auth, authorize } = require('../middleware/auth');

// Routes
router.get('/', auth, authorize([1]), getAllRackItems); // Admin only
router.get('/:id', auth, authorize([1]), getRackItemById); // Admin only
router.post('/', auth, authorize([1]), createRackItem); // Admin only
router.put('/:id', auth, authorize([1]), updateRackItem); // Admin only
router.delete('/:id', auth, authorize([1]), deleteRackItem); // Admin only
router.post('/insert', auth, authorize([1]), insertItemIntoSlot); // Admin only

module.exports = router;
