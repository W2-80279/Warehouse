const express = require('express');
const router = express.Router();
const { 
  getAllStockMovements, 
  getStockMovementById, 
  createStockMovement, 
  updateStockMovement, 
  deleteStockMovement 
} = require('../controllers/StockMovementController');
const { auth, authorize } = require('../middleware/auth');

// Routes
router.get('/', auth, authorize([1]), getAllStockMovements); 
router.get('/:id', auth, authorize([1]), getStockMovementById); 
router.post('/', auth, authorize([1]), createStockMovement); 
router.put('/:id', auth, authorize([1]), updateStockMovement); 
router.delete('/:id', auth, authorize([1]), deleteStockMovement);

module.exports = router;
