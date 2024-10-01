const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const RackSlot = require('./RackSlot');
const RackItem = require('./RackItem');
const User = require('./User');

const StockMovement = sequelize.define('StockMovement', {
    movementId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rackItemId: {
        type: DataTypes.INTEGER,
        references: {
            model: RackItem,
            key: 'rackItemId'
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
    timestamps: true
});

// Define associations
StockMovement.belongsTo(RackSlot, {
    foreignKey: 'fromRackId',
    targetKey: 'rackId'
});
StockMovement.belongsTo(RackSlot, {
    foreignKey: 'fromSlotId',
    targetKey: 'id'
});
StockMovement.belongsTo(RackSlot, {
    foreignKey: 'toRackId',
    targetKey: 'rackId'
});
StockMovement.belongsTo(RackSlot, {
    foreignKey: 'toSlotId',
    targetKey: 'id'
});
StockMovement.belongsTo(RackItem, {
    foreignKey: 'rackItemId',
    targetKey: 'rackItemId',
    onDelete: 'RESTRICT' // Prevent cascade deletes
});
StockMovement.belongsTo(User, {
    foreignKey: 'movedBy',
    targetKey: 'userId',
    onDelete: 'CASCADE'
});

module.exports = StockMovement;
