const Item = require('../models/Item');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');  // Ensure correct path
// Get all items
// Get all items with category name

exports.getAllItems = async (req, res) => {
    try {
        console.log('Fetching items...');
        const items = await Item.findAll({
            include: [
                { model: Category, as: 'Category', attributes: ['categoryName'] },
                { model: Supplier, as: 'Supplier', attributes: ['supplierName'] } // Adjust as needed
            ]
        });
        console.log('Items fetched successfully:', items);
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
};



// Get item by ID
exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item', error });
    }
};

// Create a new item
exports.createItem = async (req, res) => {
    const { sku, name, description, unitOfMeasure, categoryId, stockLevel, minStockLevel, supplierId } = req.body;
    try {
        const newItem = await Item.create({
            sku,
            name,
            description,
            unitOfMeasure,
            categoryId,
            stockLevel,
            minStockLevel,
            supplierId
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
};

// Update an item
exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        
        const { sku, name, description, unitOfMeasure, categoryId, stockLevel, minStockLevel, supplierId } = req.body;
        await item.update({
            sku,
            name,
            description,
            unitOfMeasure,
            categoryId,
            stockLevel,
            minStockLevel,
            supplierId
        });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error });
    }
};

// Delete an item
exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await item.destroy();
        res.status(204).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
    }
};
