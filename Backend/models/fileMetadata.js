const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const FileMetadata = sequelize.define('FileMetadata', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tableName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalFileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploadTime: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'FileMetadata',
  timestamps: false,
});

module.exports = FileMetadata;
