const {  DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Supplier = sequelize.define('Supplier', {
    supplierId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    supplierName: {
        type: DataTypes.STRING(100)
    },
    contactPerson: {
        type: DataTypes.STRING(100)
    },
    phone: {
        type: DataTypes.STRING(20)
    },
    email: {
        type: DataTypes.STRING(100)
    },
    address: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: false
});

module.exports = Supplier;
