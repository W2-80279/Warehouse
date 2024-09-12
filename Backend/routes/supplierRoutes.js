const express = require('express');
const router = express.Router();
const { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/SupplierController');
const { auth, authorize } = require('../middleware/auth');

// Routes
router.get('/', auth, authorize([1]), getAllSuppliers); // Admin only
router.get('/:id', auth, authorize([1]), getSupplierById); // Admin only
router.post('/', auth, authorize([1]), createSupplier); // Admin only
router.put('/:id', auth, authorize([1]), updateSupplier); // Admin only
router.delete('/:id', auth, authorize([1]), deleteSupplier); // Admin only

module.exports = router;
