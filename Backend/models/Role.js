const {Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import the Sequelize instance

// Define the Role model
const Role = sequelize.define('Role', {
    roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'RoleID'
    },
    roleName: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        field: 'RoleName'
    },
    description: {
        type: DataTypes.TEXT,
        field: 'Description'
    }
}, {
    timestamps: false // Disable timestamps
});

// Export the model
module.exports = Role;
