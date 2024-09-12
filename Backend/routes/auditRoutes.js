const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { auth, authorize } = require('../middleware/auth');

// Get all audit trails (Admin only)
router.get('/', auth, authorize([1]), auditController.getAllAuditTrails);

// Get an audit trail by ID (Admin only)
router.get('/:id', auth, authorize([1]), auditController.getAuditTrailById);

// Create a new audit trail (Admin only)
router.post('/', auth, authorize([1]), auditController.createAuditTrail);

// Update an audit trail (Admin only)
router.put('/:id', auth, authorize([1]), auditController.updateAuditTrail);

// Delete an audit trail (Admin only)
router.delete('/:id', auth, authorize([1]), auditController.deleteAuditTrail);

module.exports = router;
