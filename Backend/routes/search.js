// routes/search.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Rack = require('../models/Rack');
const Item = require('../models/Item');
const RackSlot = require('../models/RackSlot');
const RackItem = require('../models/RackItem');
const { auth, authorize } = require('../middleware/auth'); // Import middleware

// Helper function to create a search query across all fields of a model
const createSearchQuery = (model, searchQuery) => {
  const searchConditions = [];
  Object.keys(model.rawAttributes).forEach((key) => {
    const attribute = model.rawAttributes[key];
    if (['STRING', 'TEXT', 'INTEGER', 'FLOAT', 'DOUBLE', 'BOOLEAN'].includes(attribute.type.key)) {
      searchConditions.push({ [key]: { [Op.like]: `%${searchQuery}%` } });
    }
  });
  return { [Op.or]: searchConditions };
};

// Apply auth and authorize middleware for the search route
router.get('/global-search', auth, authorize([1]), async (req, res) => {
  const searchQuery = req.query.q; // Search query from the client

  try {
    // Search in the Rack model
    const racks = await Rack.findAll({
      where: createSearchQuery(Rack, searchQuery)
    });

    // Search in the Item model
    const items = await Item.findAll({
      where: createSearchQuery(Item, searchQuery)
    });

    // Search in the RackSlot model
    const rackSlots = await RackSlot.findAll({
      where: createSearchQuery(RackSlot, searchQuery)
    });

    // Search in the RackItem model (with associations)
    const rackItems = await RackItem.findAll({
      where: createSearchQuery(RackItem, searchQuery),
      include: [Item, RackSlot] // Include associations for context
    });

    // Combine and send results
    res.json({
      racks,
      items,
      rackSlots,
      rackItems,
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during the search' });
  }
});

module.exports = router;
