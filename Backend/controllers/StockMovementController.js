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

exports.createStockMovement = async (req, res) => {
    const { rackItemId, fromRackId, fromSlotId, toRackId, toSlotId, quantity, movementDate, movedBy } = req.body;

    console.log("Received Stock Movement Request: ", req.body);

    const transaction = await sequelize.transaction();
    try {
        // Validate quantity
        const parsedQuantity = Number(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be a positive valid number' });
        }

        // Find the RackItem in the source slot
        const fromRackItem = await RackItem.findOne({
            where: { rackItemId, rackSlotId: fromSlotId },
            transaction
        });

        if (!fromRackItem) {
            console.log(`Rack item not found in the source slot (rackItemId: ${rackItemId}, fromSlotId: ${fromSlotId})`);
            return res.status(404).json({ error: 'Rack item not found in the source slot' });
        }

        // Fetch the target rack slot
        const toRackSlot = await RackSlot.findByPk(toSlotId, { transaction });
        if (!toRackSlot) {
            console.log(`Target slot not found (toSlotId: ${toSlotId})`);
            return res.status(404).json({ error: 'Target slot not found' });
        }

        // Calculate available quantity for movement
        const availableQuantity = await calculateAvailableQuantity(fromRackItem, toRackSlot);
        console.log(`Available quantity for movement: ${availableQuantity}`);

        // If requested quantity exceeds available, return error
        if (parsedQuantity > availableQuantity) {
            return res.status(400).json({ error: `Requested quantity exceeds available quantity. Available: ${availableQuantity}` });
        }

        // Fetch and log source slot
        const fromRackSlot = await RackSlot.findByPk(fromSlotId, { transaction });
        if (!fromRackSlot) {
            console.log(`Source slot not found (fromSlotId: ${fromSlotId})`);
            return res.status(404).json({ error: 'Source slot not found' });
        }

        // Update current capacities
        fromRackSlot.currentCapacity -= parsedQuantity; // Decrease capacity of source slot
        toRackSlot.currentCapacity += parsedQuantity;   // Increase capacity of target slot

        await Promise.all([fromRackSlot.save({ transaction }), toRackSlot.save({ transaction })]);

        // Create the stock movement record
        const stockMovement = await StockMovement.create({
            rackItemId,
            fromRackId,
            fromSlotId,
            toRackId,
            toSlotId,
            quantity: parsedQuantity,
            movementDate,
            movedBy
        }, { transaction });

        console.log(`Stock movement recorded: `, stockMovement);

        // Update the quantity in the source rack item
        fromRackItem.quantityStored -= parsedQuantity;
        console.log(`Updating fromRackItem quantity. New quantity: ${fromRackItem.quantityStored}`);
        if (fromRackItem.quantityStored <= 0) {
            await fromRackItem.destroy({ transaction }); // Delete if quantity is zero
            console.log(`Rack item destroyed as quantity is zero (rackItemId: ${rackItemId})`);
        } else {
            await fromRackItem.save({ transaction });
        }

        // Check if an item already exists in the target slot
        let toRackItem = await RackItem.findOne({
            where: { itemId: fromRackItem.itemId, rackSlotId: toSlotId },
            transaction
        });

        if (toRackItem) {
            // If the item exists, update the quantity
            toRackItem.quantityStored += parsedQuantity;
            console.log(`Updated existing rack item in target slot. New quantity: ${toRackItem.quantityStored}`);
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
            console.log(`Created new rack item in target slot (toSlotId: ${toSlotId})`);
        }

        await transaction.commit();
        res.status(201).json(stockMovement);
    } catch (error) {
        console.error("Error during stock movement:", error);
        await transaction.rollback(); // Rollback the transaction on error
        res.status(500).json({ message: 'Error during stock movement', error: error.message });
    }
};


// Update an existing stock movement
exports.updateStockMovement = async (req, res) => {
    const { rackItemId, fromRackId, fromSlotId, toRackId, toSlotId, quantity, movementDate, movedBy } = req.body;

    console.log("Update Stock Movement Request Body:", req.body);

    try {
        const movement = await StockMovement.findByPk(req.params.id);

        if (!movement) {
            return res.status(404).json({ error: 'Stock movement not found' });
        }

        // Update the stock movement with new details
        Object.assign(movement, { rackItemId, fromRackId, fromSlotId, toRackId, toSlotId, quantity, movementDate, movedBy });
        await movement.save();

        console.log(`Stock movement updated successfully (id: ${req.params.id})`);
        res.status(200).json({ message: 'Stock movement updated successfully' });
    } catch (error) {
        console.error('Error updating stock movement:', error.message);
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
            console.log(`Rack item or target slot not found (rackItemId: ${rackItemId}, fromSlotId: ${fromSlotId}, toSlotId: ${toSlotId})`);
            return res.status(404).json({ error: 'Rack item or target slot not found' });
        }

        const availableQuantity = await calculateAvailableQuantity(fromRackItem, toRackSlot);
        console.log(`Available quantity for movement (rackItemId: ${rackItemId}): ${availableQuantity}`);

        res.status(200).json({ availableQuantity });
    } catch (error) {
        console.error('Error fetching available quantity:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
