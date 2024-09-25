const express = require('express');
const router = express.Router();
const {
    getAllRackItems,
    getRackItemById,
    createRackItem,
    updateRackItem,
    deleteRackItem,
    moveRackItem // Import the move function
} = require('../controllers/RackItemController');
const { auth, authorize } = require('../middleware/auth');

// Routes for Rack Items
router.get('/', auth, authorize([1]), getAllRackItems); // Admin only
router.get('/:id', auth, authorize([1]), getRackItemById); // Admin only
router.post('/', auth, authorize([1]), createRackItem); // Admin only
router.put('/:id', auth, authorize([1]), updateRackItem); // Admin only
router.delete('/:id', auth, authorize([1]), deleteRackItem); // Admin only

// New route for stock movement
router.post('/move', auth, authorize([1]), moveRackItem); // Admin only

module.exports = router;
