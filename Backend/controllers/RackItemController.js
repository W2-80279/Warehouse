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
        console.error('Error fetching rack items:', error); // Detailed logging
        res.status(500).json({ message: 'Error fetching rack items', error });
    }
};

// Get rack item by ID
exports.getRackItemById = async (req, res) => {
    try {
        const rackItem = await RackItem.findByPk(req.params.id, {
            include: [Item, RackSlot] // Include associated models
        });
        if (!rackItem) return res.status(404).json({ message: 'Rack item not found' });
        res.status(200).json(rackItem);
    } catch (error) {
        console.error('Error fetching rack item:', error); // Detailed logging
        res.status(500).json({ message: 'Error fetching rack item', error });
    }
};

// Create a new rack item
exports.createRackItem = async (req, res) => {
    const { itemId, rackSlotId, quantityStored, dateStored, labelGenerated, materialCode } = req.body;
    try {
        const newRackItem = await RackItem.create({
            itemId,
            rackSlotId,
            quantityStored,
            dateStored,
            labelGenerated,
            materialCode
        });
        res.status(201).json(newRackItem);
    } catch (error) {
        console.error('Error creating rack item:', error); // Detailed logging
        res.status(500).json({ message: 'Error creating rack item', error });
    }
};

// Update a rack item
exports.updateRackItem = async (req, res) => {
    try {
        const rackItem = await RackItem.findByPk(req.params.id);
        if (!rackItem) return res.status(404).json({ message: 'Rack item not found' });
        
        const { itemId, rackSlotId, quantityStored, dateStored, labelGenerated, materialCode } = req.body;
        await rackItem.update({
            itemId,
            rackSlotId,
            quantityStored,
            dateStored,
            labelGenerated,
            materialCode
        });
        res.status(200).json(rackItem);
    } catch (error) {
        console.error('Error updating rack item:', error); // Detailed logging
        res.status(500).json({ message: 'Error updating rack item', error });
    }
};

// Delete a rack item
exports.deleteRackItem = async (req, res) => {
    try {
        const rackItem = await RackItem.findByPk(req.params.id);
        if (!rackItem) return res.status(404).json({ message: 'Rack item not found' });

        await rackItem.destroy();
        res.status(204).json({ message: 'Rack item deleted successfully' });
    } catch (error) {
        console.error('Error deleting rack item:', error); // Detailed logging
        res.status(500).json({ message: 'Error deleting rack item', error });
    }
};

// Insert item into rack slot if space is available
exports.insertItemIntoSlot = async (req, res) => {
    const { itemId, rackSlotId, quantityStored, materialCode } = req.body;

    try {
        // Check if there's enough space in the slot
        const rackSlot = await RackSlot.findByPk(rackSlotId);
        if (!rackSlot) return res.status(404).json({ message: 'Rack slot not found' });

        if (rackSlot.currentCapacity < quantityStored) {
            return res.status(400).json({ message: 'Not enough space in the slot' });
        }

        // Insert the item into the slot
        const newRackItem = await RackItem.create({
            itemId,
            rackSlotId,
            quantityStored,
            dateStored: new Date(), // Use current date
            labelGenerated: false, // Adjust as needed
            materialCode
        });

        // Update the slot capacity
        await rackSlot.update({
            currentCapacity: rackSlot.currentCapacity - quantityStored
        });

        res.status(201).json(newRackItem);
    } catch (error) {
        console.error('Error inserting item into rack slot:', error); // Detailed logging
        res.status(500).json({ message: 'Error inserting item into rack slot', error });
    }
};
