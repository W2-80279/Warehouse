const { sequelize } = require('../config/db');
const StockMovement = require('../models/StockMovement');
const RackSlot = require('../models/RackSlot');
const RackItem = require('../models/RackItem');

// Calculate available quantity for movement
const calculateAvailableQuantity = async (fromRackItem, toRackSlot) => {
    const availableInSource = fromRackItem.quantityStored; // Available quantity in source
    const availableInTarget = toRackSlot.capacity - toRackSlot.currentCapacity; // Available capacity in target slot
    console.log(`Calculating available quantity: From RackItem(${availableInSource}) to RackSlot(${availableInTarget})`);
    return Math.min(availableInSource, availableInTarget); // Return the minimum of both
};

// Move items between slots and adjust current capacity
exports.createStockMovement = async (req, res) => {
    const { rackItemId, fromRackId, fromSlotId, toRackId, toSlotId, quantity, movementDate, movedBy } = req.body;

    const transaction = await sequelize.transaction();
    try {
        // Validate the quantity to be moved
        const parsedQuantity = Number(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be a positive valid number' });
        }

        // Fetch the rack items in the source slot and target slot
        const fromRackItem = await RackItem.findOne({ where: { rackItemId, rackSlotId: fromSlotId }, transaction });
        if (!fromRackItem) return res.status(404).json({ error: 'Rack item not found in source slot' });

        const toRackSlot = await RackSlot.findByPk(toSlotId, { transaction });
        if (!toRackSlot) return res.status(404).json({ error: 'Target slot not found' });

        const fromRackSlot = await RackSlot.findByPk(fromSlotId, { transaction });
        if (!fromRackSlot) return res.status(404).json({ error: 'Source slot not found' });

        // Check if target slot has enough space for the quantity
        if (toRackSlot.capacity - toRackSlot.currentCapacity < parsedQuantity) {
            return res.status(400).json({ error: 'Not enough space in the target slot' });
        }

        // Adjust the current capacities of the source and target slots
        fromRackSlot.currentCapacity += parsedQuantity;  // Increase available space in source slot
        toRackSlot.currentCapacity -= parsedQuantity;    // Decrease available space in target slot

        await Promise.all([fromRackSlot.save({ transaction }), toRackSlot.save({ transaction })]);

        // Update rack items in source and target slots
        fromRackItem.quantityStored -= parsedQuantity;
        if (fromRackItem.quantityStored <= 0) {
            await fromRackItem.destroy({ transaction }); // Remove item if it's empty
        } else {
            await fromRackItem.save({ transaction });
        }

        let toRackItem = await RackItem.findOne({ where: { itemId: fromRackItem.itemId, rackSlotId: toSlotId }, transaction });
        if (toRackItem) {
            toRackItem.quantityStored += parsedQuantity; // Update quantity if already exists
            await toRackItem.save({ transaction });
        } else {
            // Create a new rack item in the target slot
            await RackItem.create({
                itemId: fromRackItem.itemId,
                rackSlotId: toSlotId,
                quantityStored: parsedQuantity,
                dateStored: new Date(),
                labelGenerated: fromRackItem.labelGenerated,
                materialCode: fromRackItem.materialCode
            }, { transaction });
        }

        await transaction.commit();
        res.status(201).json({ message: 'Stock movement successful' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error during stock movement:', error);
        res.status(500).json({ message: 'Error during stock movement', error: error.message });
    }
};

// Update an existing stock movement
exports.updateStockMovement = async (req, res) => {
    const { rackItemId, fromRackId, fromSlotId, toRackId, toSlotId, quantity, movementDate, movedBy } = req.body;

    console.log("Update Stock Movement Request Body:", req.body);

    const transaction = await sequelize.transaction(); // Start a transaction
    try {
        const movement = await StockMovement.findByPk(req.params.id, { transaction });

        if (!movement) {
            return res.status(404).json({ error: 'Stock movement not found' });
        }

        // Reverse the original quantity moved before applying the update
        const fromRackSlot = await RackSlot.findByPk(movement.fromSlotId, { transaction });
        const toRackSlot = await RackSlot.findByPk(movement.toSlotId, { transaction });

        // Ensure both slots are found
        if (!fromRackSlot || !toRackSlot) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Source or target slot not found' });
        }

        // Revert the old movement (restore the original quantities)
        fromRackSlot.currentCapacity += movement.quantity;  // Add back to source
        toRackSlot.currentCapacity -= movement.quantity;    // Subtract from target

        // Save the reverted state of the slots
        await Promise.all([fromRackSlot.save({ transaction }), toRackSlot.save({ transaction })]);

        // Validate the new quantity
        const parsedQuantity = Number(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Quantity must be a positive valid number' });
        }

        // Ensure new movement does not exceed slot capacities
        if (fromRackSlot.currentCapacity - parsedQuantity < 0 || toRackSlot.currentCapacity + parsedQuantity > toRackSlot.capacity) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid quantity, exceeds slot capacities' });
        }

        // Update with the new movement details and quantities
        Object.assign(movement, { rackItemId, fromRackId, fromSlotId, toRackId, toSlotId, quantity: parsedQuantity, movementDate, movedBy });

        // Apply the new movement to update the capacities again
        fromRackSlot.currentCapacity -= parsedQuantity;  // Decrease from source
        toRackSlot.currentCapacity += parsedQuantity;    // Increase in target

        // Save the updated slots and movement
        await Promise.all([fromRackSlot.save({ transaction }), toRackSlot.save({ transaction }), movement.save({ transaction })]);

        await transaction.commit();
        console.log(`Stock movement updated successfully (id: ${req.params.id})`);
        res.status(200).json({ message: 'Stock movement updated successfully' });
    } catch (error) {
        console.error('Error updating stock movement:', error.message);
        await transaction.rollback();
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Fetch all stock movements
exports.getAllStockMovements = async (req, res) => {
    try {
        const movements = await StockMovement.findAll({
            include: [{ model: RackItem }]
        });
        console.log(`Fetched all stock movements: ${movements.length} records found`);
        res.status(200).json(movements);
    } catch (error) {
        console.error('Error fetching stock movements:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Fetch a stock movement by ID
exports.getStockMovementById = async (req, res) => {
    try {
        const movement = await StockMovement.findByPk(req.params.id, {
            include: [{ model: RackItem }]
        });

        if (!movement) {
            console.log(`Stock movement not found (id: ${req.params.id})`);
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
            console.log(`Stock movement not found for deletion (id: ${req.params.id})`);
            return res.status(404).json({ error: 'Stock movement not found' });
        }

        console.log(`Stock movement deleted successfully (id: ${req.params.id})`);
        res.status(200).json({ message: 'Stock movement deleted successfully' });
    } catch (error) {
        console.error('Error deleting stock movement:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Get available quantity for movement
exports.getAvailableQuantity = async (req, res) => {
    const { rackItemId, fromSlotId, toSlotId } = req.query;

    try {
        const fromRackItem = await RackItem.findOne({
            where: { rackItemId, rackSlotId: fromSlotId }
        });

        const toRackSlot = await RackSlot.findByPk(toSlotId);

        if (!fromRackItem || !toRackSlot) {
            return res.status(404).json({ error: 'Rack item or slot not found' });
        }

        const availableQuantity = await calculateAvailableQuantity(fromRackItem, toRackSlot);
        res.status(200).json({ availableQuantity });
    } catch (error) {
        console.error('Error fetching available quantity:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
