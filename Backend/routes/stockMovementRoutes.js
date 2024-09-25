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
const { body, param, validationResult } = require('express-validator');

// Validation rules
const stockMovementValidation = [
  body('itemId').isInt().withMessage('Item ID must be an integer'),
  body('fromRackId').isInt().withMessage('From Rack ID must be an integer'),
  body('fromSlotId').isInt().withMessage('From Slot ID must be an integer'),
  body('toRackId').isInt().withMessage('To Rack ID must be an integer'),
  body('toSlotId').isInt().withMessage('To Slot ID must be an integer'),
  body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
  body('movementDate').isISO8601().withMessage('Invalid date format'),
  body('movedBy').isInt().withMessage('Moved By must be an integer')
];

const stockMovementIdValidation = [
  param('id').isInt().withMessage('ID must be an integer')
];

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes
router.get('/', auth, authorize([1]), getAllStockMovements); // Admin only
router.get('/:id', auth, authorize([1]), stockMovementIdValidation, validateRequest, getStockMovementById); // Admin only
router.post('/', auth, authorize([1]), stockMovementValidation, validateRequest, createStockMovement); // Admin only
router.put('/:id', auth, authorize([1]), stockMovementIdValidation, stockMovementValidation, validateRequest, updateStockMovement); // Admin only
router.delete('/:id', auth, authorize([1]), stockMovementIdValidation, validateRequest, deleteStockMovement); // Admin only

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

module.exports = router;
