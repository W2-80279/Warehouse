// models/Rack.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rack = sequelize.define('Rack', {
    rackId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rackCode: {
        type: DataTypes.STRING(50)
    },
    description: {
        type: DataTypes.TEXT
    },
    capacity: {
        type: DataTypes.INTEGER
    }
}, {
    timestamps: false
});

module.exports = Rack;
