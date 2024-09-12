// models/Item.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
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
        type: DataTypes.STRING(100)
    },
    description: {
        type: DataTypes.TEXT
    },
    unitOfMeasure: {
        type: DataTypes.STRING(20)
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'categoryId'
        }
    },
    stockLevel: {
        type: DataTypes.INTEGER
    },
    minStockLevel: {
        type: DataTypes.INTEGER
    },
    supplierId: {
        type: DataTypes.INTEGER,
        references: {
            model: Supplier,
            key: 'supplierId'
        }
    }
}, {
    timestamps: false
});

module.exports = Item;
