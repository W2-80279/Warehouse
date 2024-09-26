const RackSlot = require('../models/RackSlot');
const Rack = require('../models/Rack');

// Get all rack slots
exports.getAllRackSlots = async (req, res) => {
    try {
        const rackSlots = await RackSlot.findAll({
            include: [Rack]
        });
        res.status(200).json(rackSlots);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rack slots', error: error.message });
    }
};

// Get rack slot by ID
exports.getRackSlotById = async (req, res) => {
    try {
        const rackSlot = await RackSlot.findByPk(req.params.id, {
            include: [Rack]
        });
        if (!rackSlot) return res.status(404).json({ message: 'Rack slot not found' });
        res.status(200).json(rackSlot);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rack slot', error: error.message });
    }
};

// Create a new rack slot
exports.createRackSlot = async (req, res) => {
    const { rackId, slotLabel, slotCapacity, currentCapacity } = req.body;

    // Validate input
    if (!rackId || !slotLabel || slotCapacity === undefined || currentCapacity === undefined) {
        return res.status(400).json({ message: 'Rack ID, slot label, slot capacity, and current capacity are required' });
    }

    // Validate current capacity does not exceed slot capacity
    if (currentCapacity > slotCapacity) {
        return res.status(400).json({ message: 'Current capacity cannot exceed slot capacity' });
    }

    try {
        const rack = await Rack.findByPk(rackId);
        if (!rack) return res.status(404).json({ message: 'Rack not found' });

        // Calculate total capacity of the slots currently reserved in the rack
        const totalReservedCapacity = await RackSlot.sum('slotCapacity', { where: { rackId } }) || 0;

        // Calculate remaining capacity in the rack
        const remainingCapacity = rack.capacity - totalReservedCapacity;

        // Check if there's enough capacity to allocate the new slot
        if (remainingCapacity < slotCapacity) {
            return res.status(400).json({ 
                message: `Not enough remaining capacity in the rack. Available: ${remainingCapacity}, Required: ${slotCapacity}` 
            });
        }

        // Create the new rack slot
        const newRackSlot = await RackSlot.create({
            rackId,
            slotLabel,
            slotCapacity,
            currentCapacity
        });

        res.status(201).json(newRackSlot);
    } catch (error) {
        console.error("Error creating rack slot: ", error);
        res.status(500).json({ message: 'Error creating rack slot', error: error.message });
    }
};

// Update a rack slot
exports.updateRackSlot = async (req, res) => {
    try {
        const rackSlot = await RackSlot.findByPk(req.params.id);
        if (!rackSlot) return res.status(404).json({ message: 'Rack slot not found' });

        const { rackId, slotLabel, slotCapacity, currentCapacity } = req.body;

        // Validate input
        if (!rackId || !slotLabel || slotCapacity === undefined || currentCapacity === undefined) {
            return res.status(400).json({ message: 'Rack ID, slot label, slot capacity, and current capacity are required' });
        }

        // Validate current capacity does not exceed slot capacity
        if (currentCapacity > slotCapacity) {
            return res.status(400).json({ message: 'Current capacity cannot exceed slot capacity' });
        }

        const rack = await Rack.findByPk(rackId);
        if (!rack) return res.status(404).json({ message: 'Rack not found' });

        // Calculate total capacity of the slots currently reserved in the rack (before the update)
        const totalReservedCapacity = await RackSlot.sum('slotCapacity', { where: { rackId } }) || 0;

        // Calculate the new total reserved capacity after the update
        const updatedTotalReservedCapacity = totalReservedCapacity - rackSlot.slotCapacity + slotCapacity;

        // Check if the updated slot capacities exceed the rack's overall capacity
        if (updatedTotalReservedCapacity > rack.capacity) {
            return res.status(400).json({ message: 'Cannot update rack slot: total reserved capacity exceeds rack capacity' });
        }

        // Update the rack slot
        await rackSlot.update({
            rackId,
            slotLabel,
            slotCapacity,
            currentCapacity
        });

        res.status(200).json(rackSlot);
    } catch (error) {
        console.error("Error updating rack slot: ", error);
        res.status(500).json({ message: 'Error updating rack slot', error: error.message });
    }
};

// Delete a rack slot
exports.deleteRackSlot = async (req, res) => {
    try {
        const rackSlot = await RackSlot.findByPk(req.params.id);
        if (!rackSlot) return res.status(404).json({ message: 'Rack slot not found' });

        const rack = await Rack.findByPk(rackSlot.rackId);
        if (!rack) return res.status(404).json({ message: 'Rack not found' });

        // Simply delete the rack slot without changing the rack's capacity
        await rackSlot.destroy(); // Delete the slot
        res.status(204).json({ message: 'Rack slot deleted successfully' });
    } catch (error) {
        console.error("Error deleting rack slot: ", error);
        res.status(500).json({ message: 'Error deleting rack slot', error: error.message });
    }
};

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
