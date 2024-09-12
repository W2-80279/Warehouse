const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const RackItem = require('./RackItem');

const Label = sequelize.define('Label', {
    labelId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rackItemId: {
        type: DataTypes.INTEGER,
        references: {
            model: RackItem,
            key: 'rackItemId'
        }
    },
    labelCode: {
        type: DataTypes.STRING(100)
    },
    dateGenerated: {
        type: DataTypes.DATE
    }
}, {
    timestamps: false
});

module.exports = Label;
