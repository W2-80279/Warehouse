const express = require('express');
const router = express.Router();
const { getAllItems, getItemById, createItem, updateItem, deleteItem } = require('../controllers/ItemController');
const { auth, authorize } = require('../middleware/auth');

// Routes
router.get('/', auth, authorize([1]), getAllItems); // Admin only
router.get('/:id', auth, authorize([1]), getItemById); // Admin only
router.post('/', auth, authorize([1]), createItem); // Admin only
router.put('/:id', auth, authorize([1]), updateItem); // Admin only
router.delete('/:id', auth, authorize([1]), deleteItem); // Admin only

module.exports = router;
