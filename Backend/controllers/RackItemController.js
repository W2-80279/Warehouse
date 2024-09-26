const RackItem = require('../models/RackItem');
const Item = require('../models/Item');
const RackSlot = require('../models/RackSlot');

// Get all rack items
exports.getAllRackItems = async (req, res) => {
    try {
        const rackItems = await RackItem.findAll({
            include: [Item, RackSlot] // Include associated models
        });
        res.status(200).json(rackItems);
    } catch (error) {
        console.error('Error fetching rack items:', error);
        res.status(500).json({ message: 'Error fetching rack items', error });
    }
};

// Get rack item by ID
exports.getRackItemById = async (req, res) => {
    try {
        const rackItem = await RackItem.findByPk(req.params.id, {
            include: [Item, RackSlot]
        });
        if (!rackItem) return res.status(404).json({ message: 'Rack item not found' });
        res.status(200).json(rackItem);
    } catch (error) {
        console.error('Error fetching rack item:', error);
        res.status(500).json({ message: 'Error fetching rack item', error });
    }
};

// Create a new rack item

exports.createRackItem = async (req, res) => {
    const { itemId, rackSlotId, quantityStored, materialCode } = req.body;

    try {
        // Validate quantityStored
        if (typeof quantityStored !== 'number' || quantityStored <= 0) {
            return res.status(400).json({ message: 'quantityStored must be a positive integer.' });
        }

        // Check if the rack slot exists
        const rackSlot = await RackSlot.findByPk(rackSlotId);
        if (!rackSlot) return res.status(404).json({ message: 'Rack slot not found' });

        // Check if there's enough space in the slot
        if (rackSlot.currentCapacity < quantityStored) {
            return res.status(400).json({ message: 'Not enough space in the slot' });
        }

        // Insert the item into the slot
        const newRackItem = await RackItem.create({
            itemId,
            rackSlotId,
            quantityStored,
            materialCode,
            dateStored: new Date() // Use current date
        });

        // Update the slot capacity
        await rackSlot.update({
            currentCapacity: rackSlot.currentCapacity - quantityStored
        });

        res.status(201).json(newRackItem);
    } catch (error) {
        console.error('Error creating rack item:', error);
        res.status(500).json({ message: 'Error creating rack item', error });
    }
};


// Update a rack item
exports.updateRackItem = async (req, res) => {
    try {
        const rackItem = await RackItem.findByPk(req.params.id);
        if (!rackItem) return res.status(404).json({ message: 'Rack item not found' });
        
        const { itemId, rackSlotId, quantityStored, materialCode } = req.body;

        // Update the rack item
        await rackItem.update({
            itemId,
            rackSlotId,
            quantityStored,
            materialCode
        });

        res.status(200).json(rackItem);
    } catch (error) {
        console.error('Error updating rack item:', error);
        res.status(500).json({ message: 'Error updating rack item', error });
    }
};

// Delete a rack item
exports.deleteRackItem = async (req, res) => {
    try {
        const rackItem = await RackItem.findByPk(req.params.id);
        if (!rackItem) return res.status(404).json({ message: 'Rack item not found' });

        // Update the associated rack slot's current capacity
        const rackSlot = await RackSlot.findByPk(rackItem.rackSlotId);
        await rackSlot.update({
            currentCapacity: rackSlot.currentCapacity + rackItem.quantityStored
        });

        await rackItem.destroy();
        res.status(204).json({ message: 'Rack item deleted successfully' });
    } catch (error) {
        console.error('Error deleting rack item:', error);
        res.status(500).json({ message: 'Error deleting rack item', error });
    }
};

// Move a rack item to another slot
exports.moveRackItem = async (req, res) => {
    const { rackItemId, targetRackSlotId, quantityToMove } = req.body;

    try {
        const rackItem = await RackItem.findByPk(rackItemId);
        if (!rackItem) return res.status(404).json({ message: 'Rack item not found' });

        const targetSlot = await RackSlot.findByPk(targetRackSlotId);
        if (!targetSlot) return res.status(404).json({ message: 'Target rack slot not found' });

        // Check if target slot has enough capacity
        if (targetSlot.currentCapacity < quantityToMove) {
            return res.status(400).json({ message: 'Not enough space in the target slot' });
        }

        // Update source slot
        const sourceSlot = await RackSlot.findByPk(rackItem.rackSlotId);
        await sourceSlot.update({
            currentCapacity: sourceSlot.currentCapacity + quantityToMove
        });

        // Update target slot
        await targetSlot.update({
            currentCapacity: targetSlot.currentCapacity - quantityToMove
        });

        // Update the rack item with the new slot and quantity
        await rackItem.update({
            rackSlotId: targetRackSlotId,
            quantityStored: rackItem.quantityStored - quantityToMove
        });

        res.status(200).json({ message: 'Rack item moved successfully' });
    } catch (error) {
        console.error('Error moving rack item:', error);
        res.status(500).json({ message: 'Error moving rack item', error });
    }
};
