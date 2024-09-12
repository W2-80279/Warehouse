const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Item = require('./Item');
const RackSlot = require('./RackSlot');
const User = require('./User');

const StockMovement = sequelize.define('StockMovement', {
    movementId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    itemId: {
        type: DataTypes.INTEGER,
        references: {
            model: Item,
            key: 'itemId'
        }
    },
    fromRackId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RackSlot,
            key: 'rackId'
        }
    },
    fromSlotLabel: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
            model: RackSlot,
            key: 'slotLabel'
        }
    },
    toRackId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RackSlot,
            key: 'rackId'
        }
    },
    toSlotLabel: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
            model: RackSlot,
            key: 'slotLabel'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    movementDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    movedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'userId'
        }
    }
}, {
    timestamps: false
});

// Define associations
StockMovement.belongsTo(RackSlot, {
    foreignKey: 'fromRackId',
    targetKey: 'rackId'
});
StockMovement.belongsTo(RackSlot, {
    foreignKey: 'fromSlotLabel',
    targetKey: 'slotLabel'
});
StockMovement.belongsTo(RackSlot, {
    foreignKey: 'toRackId',
    targetKey: 'rackId'
});
StockMovement.belongsTo(RackSlot, {
    foreignKey: 'toSlotLabel',
    targetKey: 'slotLabel'
});
StockMovement.belongsTo(Item, {
    foreignKey: 'itemId',
    targetKey: 'itemId',
    onDelete: 'CASCADE'
});
StockMovement.belongsTo(User, {
    foreignKey: 'movedBy',
    targetKey: 'userId',
    onDelete: 'CASCADE'
});

module.exports = StockMovement;
