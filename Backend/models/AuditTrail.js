const {  DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Import correctly

const User = require('./User');

const AuditTrail = sequelize.define('AuditTrail', {
    auditId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'userId'
        }
    },
    actionPerformed: {
        type: DataTypes.TEXT
    },
    actionDate: {
        type: DataTypes.DATE
    },
    tableAffected: {
        type: DataTypes.STRING(50)
    }
}, {
    timestamps: false
});

module.exports = AuditTrail;
