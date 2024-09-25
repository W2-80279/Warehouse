const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
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
        },
        allowNull: false
    },
    fromRackId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RackSlot,
            key: 'rackId'
        }
    },
    fromSlotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RackSlot,
            key: 'id'
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
    toSlotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RackSlot,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    movementDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    movedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'userId'
        },
        allowNull: false
    }
}, {
    timestamps: true // Enable timestamps for auditing purposes
});

// Define associations
StockMovement.belongsTo(RackSlot, {
    foreignKey: 'fromRackId',
    targetKey: 'rackId',
    as: 'fromRack'
});
StockMovement.belongsTo(RackSlot, {
    foreignKey: 'fromSlotId',
    targetKey: 'id',
    as: 'fromSlot'
});
StockMovement.belongsTo(RackSlot, {
    foreignKey: 'toRackId',
    targetKey: 'rackId',
    as: 'toRack'
});
StockMovement.belongsTo(RackSlot, {
    foreignKey: 'toSlotId',
    targetKey: 'id',
    as: 'toSlot'
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
