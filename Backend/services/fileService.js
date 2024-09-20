const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Your Sequelize instance

// Function to create a dynamic model
const createDynamicModel = (tableName, columns) => {
  const modelDefinition = {};
  columns.forEach(col => {
    modelDefinition[col] = {
      type: DataTypes.STRING,
      allowNull: true
    };
  });

  return sequelize.define(tableName, modelDefinition, {
    tableName,
    timestamps: false
  });
};

// Function to create a table if not exists and insert data
const createTableIfNotExists = async (tableName, columns) => {
  const DynamicModel = createDynamicModel(tableName, columns);
  await DynamicModel.sync(); // Create table
  return DynamicModel;
};

// Function to save data to the database
const saveDataToDatabase = async (DynamicModel, data) => {
  await DynamicModel.bulkCreate(data);
};

module.exports = { createTableIfNotExists, saveDataToDatabase };
