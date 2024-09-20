const {  DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const RackSlot = sequelize.define('RackSlot', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rackId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    slotLabel: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    slotCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currentCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'RackSlots',
    indexes: [
        {
            unique: false,
            fields: ['rackId']
        },
        {
            unique: false,
            fields: ['slotLabel']
        }
    ]
});

module.exports = RackSlot;

