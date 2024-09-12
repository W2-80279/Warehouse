const AuditTrail = require('../models/AuditTrail');

// Get all audit trails (Admin only)
exports.getAllAuditTrails = async (req, res) => {
    try {
        const auditTrails = await AuditTrail.findAll();
        res.status(200).json(auditTrails);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve audit trails.' });
    }
};

// Get an audit trail by ID (Admin only)
exports.getAuditTrailById = async (req, res) => {
    try {
        const auditTrail = await AuditTrail.findByPk(req.params.id);
        if (auditTrail) {
            res.status(200).json(auditTrail);
        } else {
            res.status(404).json({ error: 'Audit trail not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve audit trail.' });
    }
};

// Create a new audit trail (Admin only)
exports.createAuditTrail = async (req, res) => {
    const { userId, actionPerformed, actionDate, tableAffected } = req.body;
    try {
        const newAuditTrail = await AuditTrail.create({
            userId,
            actionPerformed,
            actionDate,
            tableAffected
        });
        res.status(201).json(newAuditTrail);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create audit trail.' });
    }
};

// Update an audit trail (Admin only)
exports.updateAuditTrail = async (req, res) => {
    const { userId, actionPerformed, actionDate, tableAffected } = req.body;
    try {
        const auditTrail = await AuditTrail.findByPk(req.params.id);
        if (auditTrail) {
            auditTrail.userId = userId;
            auditTrail.actionPerformed = actionPerformed;
            auditTrail.actionDate = actionDate;
            auditTrail.tableAffected = tableAffected;
            await auditTrail.save();
            res.status(200).json(auditTrail);
        } else {
            res.status(404).json({ error: 'Audit trail not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update audit trail.' });
    }
};

// Delete an audit trail (Admin only)
exports.deleteAuditTrail = async (req, res) => {
    try {
        const auditTrail = await AuditTrail.findByPk(req.params.id);
        if (auditTrail) {
            await auditTrail.destroy();
            res.status(200).json({ message: 'Audit trail deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Audit trail not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete audit trail.' });
    }
};
