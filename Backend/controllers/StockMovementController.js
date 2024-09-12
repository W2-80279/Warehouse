const sequelize = require('../config/db'); // Ensure this is correct
const StockMovement = require('../models/StockMovement');
const RackItem = require('../models/RackItem');
const RackSlot = require('../models/RackSlot');

// Create a new stock movement
exports.createStockMovement = async (req, res) => {
    const { itemId, fromRackId, fromSlotLabel, toRackId, toSlotLabel, quantity, movementDate, movedBy } = req.body;

    if (!itemId || !fromRackId || !fromSlotLabel || !toRackId || !toSlotLabel || !quantity || !movementDate || !movedBy) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const fromRackItem = await RackItem.findOne({ where: { itemId, rackSlotLabel: fromSlotLabel, rackId: fromRackId } });
        const toRackItem = await RackItem.findOne({ where: { itemId, rackSlotLabel: toSlotLabel, rackId: toRackId } });
        const fromRackSlot = await RackSlot.findOne({ where: { rackId: fromRackId, slotLabel: fromSlotLabel } });
        const toRackSlot = await RackSlot.findOne({ where: { rackId: toRackId, slotLabel: toSlotLabel } });

        if (!fromRackItem) {
            return res.status(400).json({ error: 'Item not found in the source slot' });
        }

        if (fromRackItem.quantityStored < quantity) {
            return res.status(400).json({ error: 'Insufficient quantity in the source slot' });
        }

        if (toRackSlot.currentCapacity + quantity > toRackSlot.slotCapacity) {
            return res.status(400).json({ error: 'Not enough capacity in the destination slot' });
        }

        // Update quantities and capacities
        fromRackItem.quantityStored -= quantity;
        await fromRackItem.save();

        if (toRackItem) {
            toRackItem.quantityStored += quantity;
            await toRackItem.save();
        } else {
            await RackItem.create({
                itemId,
                rackSlotLabel: toSlotLabel,
                rackId: toRackId,
                quantityStored: quantity,
                dateStored: movementDate,
                labelGenerated: false,
                materialCode: 'M3456'
            });
        }

        fromRackSlot.currentCapacity += quantity;
        toRackSlot.currentCapacity -= quantity;

        await fromRackSlot.save();
        await toRackSlot.save();

        await StockMovement.create({
            itemId,
            fromRackId,
            fromSlotLabel,
            toRackId,
            toSlotLabel,
            quantity,
            movementDate,
            movedBy
        });

        res.status(201).json({ message: 'Stock movement created successfully' });
    } catch (error) {
        console.error('Error creating stock movement:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Update a stock movement
exports.updateStockMovement = async (req, res) => {
    const { itemId, fromRackId, fromSlotId, toRackId, toSlotId, quantity, movementDate, movedBy } = req.body;

    if (!itemId || !fromRackId || !fromSlotId || !toRackId || !toSlotId || !quantity || !movementDate || !movedBy) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const movement = await StockMovement.findByPk(req.params.id);

        if (movement) {
            movement.itemId = itemId;
            movement.fromRackId = fromRackId;
            movement.fromSlotId = fromSlotId;
            movement.toRackId = toRackId;
            movement.toSlotId = toSlotId;
            movement.quantity = quantity;
            movement.movementDate = movementDate;
            movement.movedBy = movedBy;
            await movement.save();

            res.status(200).json({ message: 'Stock movement updated successfully' });
        } else {
            res.status(404).json({ error: 'Stock movement not found' });
        }
    } catch (error) {
        console.error('Error updating stock movement:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// Delete a stock movement
exports.deleteStockMovement = async (req, res) => {
    try {
        const result = await StockMovement.destroy({ where: { id: req.params.id } });

        if (result) {
            res.status(200).json({ message: 'Stock movement deleted successfully' });
        } else {
            res.status(404).json({ error: 'Stock movement not found' });
        }
    } catch (error) {
        console.error('Error deleting stock movement:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// Fetch all stock movements
exports.getAllStockMovements = async (req, res) => {
    try {
        const movements = await StockMovement.findAll();
        res.status(200).json(movements);
    } catch (error) {
        console.error('Error fetching stock movements:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// Fetch a stock movement by ID
exports.getStockMovementById = async (req, res) => {
    try {
        const movement = await StockMovement.findByPk(req.params.id);

        if (movement) {
            res.status(200).json(movement);
        } else {
            res.status(404).json({ error: 'Stock movement not found' });
        }
    } catch (error) {
        console.error('Error fetching stock movement:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
