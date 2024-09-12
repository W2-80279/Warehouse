const Rack = require('../models/Rack');

// Get all racks
exports.getAllRacks = async (req, res) => {
    try {
        const racks = await Rack.findAll();
        res.status(200).json(racks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching racks', error });
    }
};

// Get rack by ID
exports.getRackById = async (req, res) => {
    try {
        const rack = await Rack.findByPk(req.params.id);
        if (!rack) return res.status(404).json({ message: 'Rack not found' });
        res.status(200).json(rack);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rack', error });
    }
};

// Create a new rack
exports.createRack = async (req, res) => {
    const { rackCode, description, capacity } = req.body;
    try {
        const newRack = await Rack.create({
            rackCode,
            description,
            capacity
        });
        res.status(201).json(newRack);
    } catch (error) {
        res.status(500).json({ message: 'Error creating rack', error });
    }
};

// Update a rack
exports.updateRack = async (req, res) => {
    try {
        const rack = await Rack.findByPk(req.params.id);
        if (!rack) return res.status(404).json({ message: 'Rack not found' });
        
        const { rackCode, description, capacity } = req.body;
        await rack.update({
            rackCode,
            description,
            capacity
        });
        res.status(200).json(rack);
    } catch (error) {
        res.status(500).json({ message: 'Error updating rack', error });
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
        res.status(500).json({ message: 'Error deleting rack', error });
    }
};
