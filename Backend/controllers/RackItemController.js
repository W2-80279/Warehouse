const RackItem = require('../models/RackItem');
const Item = require('../models/Item');
const RackSlot = require('../models/RackSlot');
const { sequelize }= require('../config/db');

// Get all rack items
exports.getAllRackItems = async (req, res) => {
    try {
        const rackItems = await RackItem.findAll({
            include: [Item, RackSlot] // Include associated models
        });
        res.status(200).json(rackItems);
    } catch (error) {
        console.error('Error fetching rack items:', error);
        res.status(500).json({ message: 'Error fetching rack items', error: error.message });
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
        res.status(500).json({ message: 'Error fetching rack item', error: error.message });
    }
};

// Create a new rack item
exports.createRackItem = async (req, res) => {
    const { itemId, rackSlotId, quantityStored, materialCode } = req.body;

    const transaction = await sequelize.transaction();
    try {
        // Validate quantityStored
        if (typeof quantityStored !== 'number' || quantityStored <= 0) {
            return res.status(400).json({ message: 'quantityStored must be a positive integer.' });
        }

        // Check if the rack slot exists
        const rackSlot = await RackSlot.findByPk(rackSlotId, { transaction });
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
            dateStored: new Date()
        }, { transaction });

        // Update the slot capacity
        await rackSlot.update({
            currentCapacity: rackSlot.currentCapacity - quantityStored
        }, { transaction });

        await transaction.commit();
        res.status(201).json(newRackItem);
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating rack item:', error);
        res.status(500).json({ message: 'Error creating rack item', error: error.message });
    }
};

// Update a rack item
exports.updateRackItem = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const rackItem = await RackItem.findByPk(req.params.id, { transaction });
        if (!rackItem) return res.status(404).json({ message: 'Rack item not found' });

        const { itemId, rackSlotId, quantityStored, materialCode } = req.body;

        // Validate quantityStored
        if (typeof quantityStored !== 'number' || quantityStored <= 0) {
            return res.status(400).json({ message: 'quantityStored must be a positive integer.' });
        }

        // Check if the rack slot exists
        const rackSlot = await RackSlot.findByPk(rackSlotId, { transaction });
        if (!rackSlot) return res.status(404).json({ message: 'Rack slot not found' });

        // Update the rack item
        await rackItem.update({
            itemId,
            rackSlotId,
            quantityStored,
            materialCode
        }, { transaction });

        await transaction.commit();
        res.status(200).json(rackItem);
    } catch (error) {
        await transaction.rollback();
        console.error('Error updating rack item:', error);
        res.status(500).json({ message: 'Error updating rack item', error: error.message });
    }
};

// Delete a rack item (with proper capacity management)
exports.deleteRackItem = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const rackItem = await RackItem.findByPk(req.params.id, { transaction });
        if (!rackItem) return res.status(404).json({ message: 'Rack item not found' });

        // Update the associated rack slot's current capacity
        const rackSlot = await RackSlot.findByPk(rackItem.rackSlotId, { transaction });
        await rackSlot.update({
            currentCapacity: rackSlot.currentCapacity + rackItem.quantityStored
        }, { transaction });

        // Delete the rack item
        await rackItem.destroy({ transaction });
        await transaction.commit();

        res.status(204).json({ message: 'Rack item deleted successfully' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting rack item:', error);
        res.status(500).json({ message: 'Error deleting rack item', error: error.message });
    }
};
