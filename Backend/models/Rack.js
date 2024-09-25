// models/Rack.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Rack = sequelize.define('Rack', {
    rackId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rackCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1 // Ensure capacity is positive
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: 'Racks'
});

module.exports = Rack;
