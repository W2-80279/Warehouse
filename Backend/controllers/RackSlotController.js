const RackSlot = require('../models/RackSlot');
const Rack = require('../models/Rack');

// Get all rack slots
exports.getAllRackSlots = async (req, res) => {
    try {
        const rackSlots = await RackSlot.findAll({
            include: [Rack] // Include associated model
        });
        res.status(200).json(rackSlots);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rack slots', error });
    }
};

// Get rack slot by ID
exports.getRackSlotById = async (req, res) => {
    try {
        const rackSlot = await RackSlot.findByPk(req.params.id, {
            include: [Rack] // Include associated model
        });
        if (!rackSlot) return res.status(404).json({ message: 'Rack slot not found' });
        res.status(200).json(rackSlot);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rack slot', error });
    }
};

// Create a new rack slot
exports.createRackSlot = async (req, res) => {
    const { rackId, slotLabel, slotCapacity, currentCapacity } = req.body;
    try {
        const newRackSlot = await RackSlot.create({
            rackId,
            slotLabel,
            slotCapacity,
            currentCapacity
        });
        res.status(201).json(newRackSlot);
    } catch (error) {
        res.status(500).json({ message: 'Error creating rack slot', error });
    }
};

// Update a rack slot
exports.updateRackSlot = async (req, res) => {
    try {
        const rackSlot = await RackSlot.findByPk(req.params.id);
        if (!rackSlot) return res.status(404).json({ message: 'Rack slot not found' });

        const { rackId, slotLabel, slotCapacity, currentCapacity } = req.body;
        await rackSlot.update({
            rackId,
            slotLabel,
            slotCapacity,
            currentCapacity
        });
        res.status(200).json(rackSlot);
    } catch (error) {
        res.status(500).json({ message: 'Error updating rack slot', error });
    }
};

// Delete a rack slot
exports.deleteRackSlot = async (req, res) => {
    try {
        const rackSlot = await RackSlot.findByPk(req.params.id);
        if (!rackSlot) return res.status(404).json({ message: 'Rack slot not found' });

        await rackSlot.destroy();
        res.status(204).json({ message: 'Rack slot deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting rack slot', error });
    }
};


// GET /api/rackslots/capacity/1/A1
// Check slot capacity by RackID and SlotLabel
exports.checkSlotCapacity = async (req, res) => {
    const { rackId, slotLabel } = req.params;
    try {
        const rackSlot = await RackSlot.findOne({
            where: { rackId, slotLabel }
        });
        if (!rackSlot) return res.status(404).json({ message: 'Rack slot not found' });
        
        res.status(200).json({ currentCapacity: rackSlot.currentCapacity });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching slot capacity', error });
    }
};
