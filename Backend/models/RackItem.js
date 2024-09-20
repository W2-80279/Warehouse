const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Item = require('./Item');
const RackSlot = require('./RackSlot');

const RackItem = sequelize.define('RackItem', {
    rackItemId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    itemId: {
        type: DataTypes.INTEGER,
        references: {
            model: Item,
            key: 'itemId'
        },
        allowNull: false
    },
    rackSlotId: {
        type: DataTypes.INTEGER,
        references: {
            model: RackSlot,
            key: 'id' // Ensure this matches the primary key field in RackSlot
        },
        allowNull: false
    },
    quantityStored: {
        type: DataTypes.INTEGER
    },
    dateStored: {
        type: DataTypes.DATE
    },
    labelGenerated: {
        type: DataTypes.BOOLEAN
    },
    materialCode: {
        type: DataTypes.STRING(50)
    }
}, {
    timestamps: false,
    tableName: 'RackItems'
});

module.exports = RackItem;
