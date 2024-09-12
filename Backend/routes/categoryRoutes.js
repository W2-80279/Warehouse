const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { 
    getCategories, 
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} = require('../controllers/Categorycontroller');

// Admin-only routes for category management
router.get('/', auth, authorize([1]), getCategories); // Get all categories
router.get('/:id', auth, authorize([1]), getCategoryById); // Get category by ID
router.post('/', auth, authorize([1]), createCategory); // Create new category
router.put('/:id', auth, authorize([1]), updateCategory); // Update category
router.delete('/:id', auth, authorize([1]), deleteCategory); // Delete category

module.exports = router;
