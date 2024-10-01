const express = require('express');
const router = express.Router();
const {
  getAllRackItems,
  getRackItemById,
  createRackItem,
  updateRackItem,
  deleteRackItem,
  getRackItemByBarcode,
  getActiveItems,
  scanBarcode // Import the scanBarcode function
} = require('../controllers/RackItemController');
const { auth, authorize } = require('../middleware/auth');

// Routes for Rack Items
router.get('/', auth, authorize([1]), getAllRackItems); // Admin only
router.get('/active', auth, authorize([1]), getActiveItems);
router.get('/:id', auth, authorize([1]), getRackItemById); // Admin only
router.post('/', auth, authorize([1]), createRackItem); // Admin only
router.put('/:id', auth, authorize([1]), updateRackItem); // Admin only
router.delete('/:id', auth, authorize([1]), deleteRackItem); // Admin only
router.get('/rack-items/barcode/:barcode',auth, authorize([1]), getRackItemByBarcode);
router.post('/scan-barcode', auth, authorize([1]), scanBarcode); // Add a new route for barcode scanning

module.exports = router;