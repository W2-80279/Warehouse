const express = require('express');
const router = express.Router();
const { getAllLabels, getLabelById, createLabel, updateLabel, deleteLabel } = require('../controllers/LabelController');
const { auth, authorize } = require('../middleware/auth');

// Routes
router.get('/', auth, authorize([1]), getAllLabels); // Admin only
router.get('/:id', auth, authorize([1]), getLabelById); // Admin only
router.post('/', auth, authorize([1]), createLabel); // Admin only
router.put('/:id', auth, authorize([1]), updateLabel); // Admin only
router.delete('/:id', auth, authorize([1]), deleteLabel); // Admin only

module.exports = router;
