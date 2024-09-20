const sequelize = require('../config/db'); // Ensure this is correct
const StockMovement = require('../models/StockMovement');
const RackItem = require('../models/RackItem');
const RackSlot = require('../models/RackSlot');

// Create a new stock movement
exports.createStockMovement = async (req, res) => {
    const { itemId, fromRackId, fromSlotId, toRackId, toSlotId, quantity, movementDate, movedBy } = req.body;
               console.log(req.body)
    // Check for missing fields
    if (!itemId || !fromRackId || !fromSlotId || !toRackId || !toSlotId || !quantity || !movementDate || !movedBy) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Convert quantity to integer if it is coming as a string
    const quantityInt = parseInt(quantity, 10);
    if (isNaN(quantityInt)) {
        return res.status(400).json({ error: 'Quantity must be a valid number' });
    }

    // Log incoming request data for debugging
    console.log('Request Data:', { itemId, fromRackId, fromSlotId, toRackId, toSlotId, quantity: quantityInt, movementDate, movedBy });

    try {
        // Log the RackItem search query parameters
        console.log('Searching for From Rack Item with:', { itemId, rackSlotId: fromSlotId });
        const fromRackItem = await RackItem.findOne({ 
            where: { itemId, rackSlotId: fromSlotId }
        });
        console.log('From Rack Item:', fromRackItem); // Debugging

        console.log('Searching for To Rack Item with:', { itemId, rackSlotId: toSlotId });
        const toRackItem = await RackItem.findOne({ 
            where: { itemId, rackSlotId: toSlotId }
        });
        console.log('To Rack Item:', toRackItem); // Debugging

        // Log the RackSlot search query parameters
        console.log('Searching for From Rack Slot with id:', fromSlotId);
        const fromRackSlot = await RackSlot.findOne({ 
            where: { id: fromSlotId } 
        });
        console.log('From Rack Slot:', fromRackSlot); // Debugging

        console.log('Searching for To Rack Slot with id:', toSlotId);
        const toRackSlot = await RackSlot.findOne({ 
            where: { id: toSlotId } 
        });
        console.log('To Rack Slot:', toRackSlot); // Debugging

        // Check if the source RackItem is found
        if (!fromRackItem) {
            console.log('Error: Item not found in the source slot'); // Debugging
            return res.status(400).json({ error: 'Item not found in the source slot' });
        }

        // Check if the quantity in the source RackItem is sufficient
        if (fromRackItem.quantityStored < quantityInt) {
            console.log('Error: Insufficient quantity in the source slot'); // Debugging
            return res.status(400).json({ error: 'Insufficient quantity in the source slot' });
        }

        // Check if the destination RackSlot has enough capacity
        if (toRackSlot.currentCapacity + quantityInt > toRackSlot.slotCapacity) {
            console.log('Error: Not enough capacity in the destination slot'); // Debugging
            return res.status(400).json({ error: 'Not enough capacity in the destination slot' });
        }

        // Update quantities and capacities
        fromRackItem.quantityStored -= quantityInt;
        await fromRackItem.save();
        console.log('Updated From Rack Item:', fromRackItem); // Debugging

        if (toRackItem) {
            toRackItem.quantityStored += quantityInt;
            await toRackItem.save();
            console.log('Updated To Rack Item:', toRackItem); // Debugging
        } else {
            await RackItem.create({
                itemId,
                rackSlotId: toSlotId,
                quantityStored: quantityInt,
                dateStored: movementDate,
                labelGenerated: false,
                materialCode: 'M3456'
            });
            console.log('Created New Rack Item in Destination Slot'); // Debugging
        }

        // Update RackSlot capacities
        fromRackSlot.currentCapacity += quantityInt;
        toRackSlot.currentCapacity -= quantityInt;
        await fromRackSlot.save();
        await toRackSlot.save();

        console.log('Updated From Rack Slot:', fromRackSlot); // Debugging
        console.log('Updated To Rack Slot:', toRackSlot); // Debugging

        // Record the stock movement
        await StockMovement.create({
            itemId,
            fromRackId,
            fromSlotId,
            toRackId,
            toSlotId,
            quantity: quantityInt,
            movementDate,
            movedBy
        });

        console.log('Stock Movement Created Successfully'); // Debugging
        res.status(201).json({ message: 'Stock movement created successfully' });
    } catch (error) {
        console.error('Error creating stock movement:', error.message); // Debugging
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
