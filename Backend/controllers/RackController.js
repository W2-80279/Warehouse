// controllers/RackController.js
const Rack = require('../models/Rack');
const RackSlot = require('../models/RackSlot');

// Get all racks
exports.getAllRacks = async (req, res) => {
    try {
        const racks = await Rack.findAll();
        res.status(200).json(racks);
    } catch (error) {
        console.error('Error fetching racks:', error);
        res.status(500).json({ message: 'Error fetching racks', error: error.message });
    }
};

// Get rack by ID
exports.getRackById = async (req, res) => {
    try {
        const rack = await Rack.findByPk(req.params.id);
        if (!rack) return res.status(404).json({ message: 'Rack not found' });
        res.status(200).json(rack);
    } catch (error) {
        console.error('Error fetching rack:', error);
        res.status(500).json({ message: 'Error fetching rack', error: error.message });
    }
};

// Create a new rack
exports.createRack = async (req, res) => {
    const { rackCode, description, capacity } = req.body;

    // Validate input
    if (!rackCode || !capacity) {
        return res.status(400).json({ message: 'Rack code and capacity are required' });
    }

    try {
        const newRack = await Rack.create({
            rackCode,
            description,
            capacity
        });
        res.status(201).json(newRack);
    } catch (error) {
        console.error('Error creating rack:', error);
        res.status(500).json({ message: 'Error creating rack', error: error.message });
    }
};

// Update a rack
exports.updateRack = async (req, res) => {
    try {
        const rack = await Rack.findByPk(req.params.id);
        if (!rack) return res.status(404).json({ message: 'Rack not found' });

        const { rackCode, description, capacity } = req.body;

        // Validate input
        if (!rackCode || !capacity) {
            return res.status(400).json({ message: 'Rack code and capacity are required' });
        }

        await rack.update({
            rackCode,
            description,
            capacity
        });
        res.status(200).json(rack);
    } catch (error) {
        console.error('Error updating rack:', error);
        res.status(500).json({ message: 'Error updating rack', error: error.message });
    }
};

// Delete a rack
exports.deleteRack = async (req, res) => {
    try {
        const rack = await Rack.findByPk(req.params.id);
        if (!rack) return res.status(404).json({ message: 'Rack not found' });

        await rack.destroy();
        res.status(204).json({ message: 'Rack deleted successfully' });
    } catch (error) {
        console.error('Error deleting rack:', error);
        res.status(500).json({ message: 'Error deleting rack', error: error.message });
    }
};

// Get available capacity for a specific rack
exports.getAvailableCapacity = async (req, res) => {
    try {
        const rackId = req.params.id;
        const rack = await Rack.findByPk(rackId);
        if (!rack) return res.status(404).json({ message: 'Rack not found' });

        // Calculate total current capacity of the rack
        const totalCurrentCapacity = await RackSlot.sum('currentCapacity', { where: { rackId } }) || 0;

        // Calculate remaining capacity
        const remainingCapacity = rack.capacity - totalCurrentCapacity;

        res.status(200).json({ availableCapacity: remainingCapacity });
    } catch (error) {
        console.error('Error fetching available capacity:', error);
        res.status(500).json({ message: 'Error fetching available capacity', error: error.message });
    }
};
