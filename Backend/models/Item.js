const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Category = require('./Category');
const Supplier = require('./Supplier');

const Item = sequelize.define('Item', {
    itemId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sku: {
        type: DataTypes.STRING(50),
        unique: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    unitOfMeasure: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'categoryId'
        }
    },
    stockLevel: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    minStockLevel: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    supplierId: {
        type: DataTypes.INTEGER,
        references: {
            model: Supplier,
            key: 'supplierId'
        }
    },
    barcode: {
        type: DataTypes.STRING, // For storing the numeric barcode
        allowNull: true
    },
    barcodeImage: {
        type: DataTypes.TEXT, // For storing the base64-encoded barcode image
        allowNull: true
    },
    
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true // URL of the uploaded image
    }
}, {
    timestamps: true
});

module.exports = Item;
