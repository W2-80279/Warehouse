const { sequelize } = require('../config/db');
const StockMovement = require('../models/StockMovement');
const RackSlot = require('../models/RackSlot');
const RackItem = require('../models/RackItem');
const Item = require('../models/Item');

// Create a new stock movement
exports.createStockMovement = async (req, res) => {
    const { itemId, fromRackId, fromSlotId, toRackId, toSlotId, quantity, movementDate, movedBy } = req.body;

    try {
        // Fetch the current slot where the item is stored (source slot)
        const fromRackItem = await RackItem.findOne({ where: { itemId, rackSlotId: fromSlotId } });

        if (!fromRackItem) {
            return res.status(400).json({ error: 'Item not found in the source slot' });
        }

        // Validate the quantity in the source slot
        if (fromRackItem.quantityStored < quantity) {
            return res.status(400).json({ error: 'Insufficient quantity in the source slot' });
        }

        // Fetch the target slot
        const toRackSlot = await RackSlot.findOne({ where: { id: toSlotId } });
        const fromRackSlot = await RackSlot.findOne({ where: { id: fromSlotId } });

        if (!toRackSlot) {
            return res.status(400).json({ error: 'Target slot not found' });
        }

        // Validate the target slot capacity
        if (toRackSlot.currentCapacity + quantity > toRackSlot.slotCapacity) {
            return res.status(400).json({ error: 'Not enough capacity in the target slot' });
        }

        // Begin transaction to ensure consistency
        const transaction = await sequelize.transaction();

        try {
            // Update the source slot's quantity and capacity
            fromRackItem.quantityStored -= quantity;
            fromRackSlot.currentCapacity -= quantity;
            await fromRackItem.save({ transaction });
            await fromRackSlot.save({ transaction });

            // Update or create the destination slot's rack item
            let toRackItem = await RackItem.findOne({ where: { itemId, rackSlotId: toSlotId } });

            if (toRackItem) {
                toRackItem.quantityStored += quantity;
                await toRackItem.save({ transaction });
            } else {
                // Create a new RackItem if it doesn't exist in the target slot
                await RackItem.create({
                    itemId,
                    rackSlotId: toSlotId,
                    quantityStored: quantity,
                    dateStored: movementDate,
                    labelGenerated: false
                }, { transaction });
            }

            // Update target slot capacity
            toRackSlot.currentCapacity += quantity;
            await toRackSlot.save({ transaction });

            // Record the stock movement
            await StockMovement.create({
                itemId,
                fromRackId,
                fromSlotId,
                toRackId,
                toSlotId,
                quantity,
                movementDate,
                movedBy
            }, { transaction });

            // Commit transaction if everything is successful
            await transaction.commit();

            res.status(201).json({ message: 'Stock movement created successfully' });

        } catch (error) {
            // Rollback transaction if any operation fails
            await transaction.rollback();
            console.error('Error during stock movement transaction:', error.message);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    } catch (error) {
        console.error('Error creating stock movement:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Update an existing stock movement
exports.updateStockMovement = async (req, res) => {
    const { itemId, fromRackId, fromSlotId, toRackId, toSlotId, quantity, movementDate, movedBy } = req.body;

    try {
        const movement = await StockMovement.findByPk(req.params.id);

        if (!movement) {
            return res.status(404).json({ error: 'Stock movement not found' });
        }

        // Update the stock movement with new details
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
    } catch (error) {
        console.error('Error updating stock movement:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Fetch all stock movements
exports.getAllStockMovements = async (req, res) => {
    try {
        const movements = await StockMovement.findAll();
        res.status(200).json(movements);
    } catch (error) {
        console.error('Error fetching stock movements:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Fetch a stock movement by ID
exports.getStockMovementById = async (req, res) => {
    try {
        const movement = await StockMovement.findByPk(req.params.id);

        if (!movement) {
            return res.status(404).json({ error: 'Stock movement not found' });
        }

        res.status(200).json(movement);
    } catch (error) {
        console.error('Error fetching stock movement by ID:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Delete a stock movement
exports.deleteStockMovement = async (req, res) => {
    try {
        const result = await StockMovement.destroy({ where: { id: req.params.id } });

        if (!result) {
            return res.status(404).json({ error: 'Stock movement not found' });
        }

        res.status(200).json({ message: 'Stock movement deleted successfully' });
    } catch (error) {
        console.error('Error deleting stock movement:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
