const Item = require('../models/Item');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const bwipjs = require('bwip-js');
const multer = require('multer');
const path = require('path');

// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify your uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
    }
});

const upload = multer({ storage });

// Middleware for image upload
exports.uploadImage = upload.single('image');

// Get all items with search, filter, and pagination
exports.getAllItems = async (req, res) => {
    const { categoryId, supplierId, minStockLevel, maxStockLevel, search, page = 1, limit = 10 } = req.query;

    try {
        const where = {};
        
        // Build filtering conditions
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (supplierId) {
            where.supplierId = supplierId;
        }
        if (minStockLevel) {
            where.stockLevel = { [Op.gte]: minStockLevel }; // Greater than or equal
        }
        if (maxStockLevel) {
            where.stockLevel = { [Op.lte]: maxStockLevel }; // Less than or equal
        }
        if (search) {
            where.name = { [Op.like]: `%${search}%` }; // Search by name
        }

        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        const items = await Item.findAndCountAll({
            where,
            include: [
                { model: Category, as: 'Category', attributes: ['categoryName'] },
                { model: Supplier, as: 'Supplier', attributes: ['supplierName'] }
            ],
            limit,
            offset
        });

        res.status(200).json({
            totalItems: items.count,
            totalPages: Math.ceil(items.count / limit),
            currentPage: Number(page),
            items: items.rows
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
};

// Get item by ID
exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Construct full URLs for images
        if (item.imageUrl) {
            item.imageUrl = `http://localhost:5000/${item.imageUrl}`;
        }
        if (item.barcodeImage) {
            item.barcodeImage = `http://localhost:5000/${item.barcodeImage}`;
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item', error });
    }
};


// Create a new item
exports.createItem = async (req, res) => {
    const { sku, name, description, unitOfMeasure, categoryId, stockLevel, minStockLevel, supplierId } = req.body;

    // Validate SKU length
    if (!sku || sku.length < 8 || sku.length > 13) {
        return res.status(400).json({ message: 'SKU must be between 8 and 13 characters long', sku });
    }

    try {
        // Generate barcode
        const { barcode, image } = await generateBarcode(sku);
        
        const imageUrl = req.file ? `uploads/${req.file.filename}` : null; // Save the image URL
        
        const newItem = await Item.create({
            sku,
            name,
            description,
            unitOfMeasure,
            categoryId,
            stockLevel,
            minStockLevel,
            supplierId,
            barcode, // Save the numeric barcode
            barcodeImage: image, // Save the base64 barcode image
            imageUrl // Save the uploaded image URL
        });
        
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
};

// Function to generate a barcode
const generateBarcode = async (data) => {
    const length = Math.floor(Math.random() * 6) + 8; // Random length between 8 and 13
    const numericBarcode = String(Math.floor(Math.random() * Math.pow(10, length))).padStart(length, '0'); // Pad with leading zeros if necessary

    return new Promise((resolve, reject) => {
        bwipjs.toBuffer({
            bcid: 'code128', // Barcode type
            text: numericBarcode, // Use the generated numeric barcode
            scale: 3, // 3x scaling factor
            height: 10, // Bar height, in millimeters
            includetext: true, // Show human-readable text
            textxalign: 'center' // Center text alignment
        }, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                const base64Image = buffer.toString('base64');
                resolve({
                    barcode: numericBarcode, 
                    image: `data:image/png;base64,${base64Image}` // Return both numeric barcode and base64 image
                });
            }
        });
    });
};

// Update an item
exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        
        const { sku, name, description, unitOfMeasure, categoryId, stockLevel, minStockLevel, supplierId } = req.body;

        const updatedData = {
            sku,
            name,
            description,
            unitOfMeasure,
            categoryId,
            stockLevel,
            minStockLevel,
            supplierId
        };

        if (req.file) {
            updatedData.imageUrl = `uploads/${req.file.filename}`; // Update image URL if a new image is uploaded
        }

        await item.update(updatedData);
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
