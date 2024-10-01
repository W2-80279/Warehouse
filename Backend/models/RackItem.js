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
            key: 'id'
        },
        allowNull: false
    },
    quantityStored: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1
        }
    },
    dateStored: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    labelGenerated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    materialCode: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    isDeleted: {  // Soft deletion flag
        type: DataTypes.BOOLEAN,
        defaultValue: false // Default to false
    }
}, {
    timestamps: false,
    tableName: 'RackItems'
});

// Associations
RackItem.belongsTo(Item, { foreignKey: 'itemId' });
RackItem.belongsTo(RackSlot, { foreignKey: 'rackSlotId' });
Item.hasMany(RackItem, { foreignKey: 'itemId' });
RackSlot.hasMany(RackItem, { foreignKey: 'rackSlotId' });

module.exports = RackItem;
