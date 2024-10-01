const RackItem = require('../models/RackItem');
const Item = require('../models/Item');
const RackSlot = require('../models/RackSlot');
const { sequelize } = require('../config/db');

// Get all rack items(include soft delete also)
exports.getAllRackItems = async (req, res) => {
    try {
        const rackItems = await RackItem.findAll({
            // where: { isDeleted: false }, // Only get non-deleted items
            include: [Item, RackSlot], // Include associated models
            paranoid:false,
        });
        res.status(200).json(rackItems);
    } catch (error) {
        console.error('Error fetching rack items:', error);
        res.status(500).json({ message: 'Error fetching rack items', error: error.message });
    }
};

exports.getActiveItems = async (req, res) => {
    try {
        const rackItems = await RackItem.findAll({
            where: { isDeleted: false }, // Only get non-deleted items
            include: [Item, RackSlot], // Include associated models
            
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
            where: { isDeleted: false }, // Ensure we only get non-deleted items
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
            dateStored: new Date(),
            isDeleted: false // Mark as not deleted
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
// Update a rack item
exports.updateRackItem = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const rackItem = await RackItem.findByPk(req.params.id, { transaction });
        if (!rackItem || rackItem.isDeleted) return res.status(404).json({ message: 'Rack item not found' });

        const { itemId, rackSlotId, quantityStored, materialCode } = req.body;

        // Validate quantityStored
        if (typeof quantityStored !== 'number' || quantityStored <= 0) {
            return res.status(400).json({ message: 'quantityStored must be a positive integer.' });
        }

        // Get the current rack slot and its capacity
        const rackSlot = await RackSlot.findByPk(rackSlotId, { transaction });
        if (!rackSlot) return res.status(404).json({ message: 'Rack slot not found' });

        // Calculate the capacity adjustment
        const capacityDifference = quantityStored - rackItem.quantityStored;

        // Update the rack item's properties
        await rackItem.update({
            itemId,
            rackSlotId,
            quantityStored,
            materialCode
        }, { transaction });

        // Update the rack slot's current capacity
        await rackSlot.update({
            currentCapacity: rackSlot.currentCapacity - capacityDifference
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
        if (!rackItem || rackItem.isDeleted) return res.status(404).json({ message: 'Rack item not found' });

        // Update the associated rack slot's current capacity
        const rackSlot = await RackSlot.findByPk(rackItem.rackSlotId, { transaction });
        await rackSlot.update({
            currentCapacity: rackSlot.currentCapacity + rackItem.quantityStored
        }, { transaction });

        // Soft delete the rack item
        await rackItem.update({ isDeleted: true }, { transaction });
        await transaction.commit();

        res.status(204).json({ message: 'Rack item deleted successfully' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting rack item:', error);
        res.status(500).json({ message: 'Error deleting rack item', error: error.message });
    }
};

// Fetch rack item details by scanning the barcode
exports.getRackItemByBarcode = async (req, res) => {
    const { barcode } = req.params;
  
    try {
      // Find the item by barcode
      const item = await Item.findOne({
        where: { barcode },
      });
  
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Find the rack item where this item is stored
      const rackItem = await RackItem.findOne({
        where: { itemId: item.itemId, isDeleted: false },
        include: [RackSlot] // Include the RackSlot details
      });
  
      if (!rackItem) {
        return res.status(404).json({ message: 'Rack item not found' });
      }
  
      // Return the rack item details along with associated item and rack slot
      res.status(200).json({
        item,
        rackItem,
        rackSlot: rackItem.RackSlot
      });
    } catch (error) {
      console.error('Error fetching rack item by barcode:', error);
      res.status(500).json({ message: 'Error fetching rack item', error: error.message });
    }
  };

// Add a new controller function to handle barcode scanning
exports.scanBarcode = async (req, res) => {
    const { barcode } = req.body;
  
    try {
      // Find the item by barcode
      const item = await Item.findOne({
        where: { barcode },
      });
  
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Find the rack item where this item is stored
      const rackItem = await RackItem.findOne({
        where: { itemId: item.itemId, isDeleted: false },
        include: [RackSlot] // Include the RackSlot details
      });
  
      if (!rackItem) {
        return res.status(404).json({ message: 'Rack item not found' });
      }
  
      // Return the rack item details along with associated item and rack slot
      res.status(200).json({
        item,
        rackItem,
        rackSlot: rackItem.RackSlot
      });
    } catch (error) {
      console.error('Error scanning barcode:', error);
      res.status(500).json({ message: 'Error scanning barcode', error: error.message });
    }
  };