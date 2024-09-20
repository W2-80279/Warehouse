const multer = require('multer');
const XLSX = require('xlsx');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;
const FileMetadata = require('../models/fileMetadata');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage }).single('file');

// Function to create a dynamic model
const createDynamicModel = (tableName, headers) => {
  const attributes = headers.reduce((acc, header) => {
    acc[header] = {
      type: DataTypes.STRING,
      allowNull: true,
    };
    return acc;
  }, {});

  return sequelize.define(tableName, attributes, {
    tableName: tableName,
    timestamps: false,
  });
};

// File upload and processing
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '../uploads/', req.file.filename);
    const ext = path.extname(req.file.originalname).toLowerCase();

    let headers = [];
    const data = [];

    if (ext === '.xlsx') {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

      if (sheet.length === 0) {
        return res.status(400).json({ message: 'No data found in file' });
      }

      headers = Object.keys(sheet[0]);
      sheet.forEach(row => data.push(row));
    } else if (ext === '.csv') {
      const rows = [];
      const stream = fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('headers', (hdrs) => {
          headers = hdrs.map(h => h.trim());
        })
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', async () => {
          if (rows.length === 0) {
            return res.status(400).json({ message: 'No data found in CSV file' });
          }
          headers = headers.length > 0 ? headers : Object.keys(rows[0]);
          data.push(...rows);
          await processFileData(headers, data, filePath, res);
        })
        .on('error', (error) => {
          console.error('Error processing CSV:', error);
          res.status(500).json({ message: 'Error processing CSV file' });
        });
      return;
    } else {
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    await processFileData(headers, data, filePath, res);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to process and save file data
const processFileData = async (headers, data, filePath, res) => {
  try {
    const tableName = `table_${Date.now()}`;
    const DynamicModel = createDynamicModel(tableName, headers);

    await DynamicModel.sync({ force: true });

    const cleanedData = data.map((row) => {
      const cleanedRow = {};
      headers.forEach((header) => {
        cleanedRow[header] = row[header] ? row[header].toString().trim() : null;
      });
      return cleanedRow;
    });

    await DynamicModel.bulkCreate(cleanedData, { validate: true });

    // Store metadata in the FileMetadata table
    await FileMetadata.create({
      tableName,
      originalFileName: path.basename(filePath),
      uploadTime: new Date(),
    });

    fs.unlinkSync(filePath);  // Clean up the file

    res.status(200).json({ message: 'File uploaded and data saved', tableName });
  } catch (error) {
    console.error('Error processing file data:', error);
    res.status(500).json({ message: 'Error processing file data' });
  }
};

// Fetch data from a table with pagination
const fetchTableData = async (req, res) => {
  let { tableName } = req.params;
  const { page = 1, limit = 100 } = req.query; // Default to page 1 and limit 100

  tableName = tableName.trim();

  try {
    let DynamicModel;
    try {
      DynamicModel = sequelize.model(tableName);
    } catch (err) {
      const queryInterface = sequelize.getQueryInterface();
      const columns = await queryInterface.describeTable(tableName);

      const attributes = {};

      for (const column in columns) {
        const columnData = columns[column];

        if (columnData && columnData.type) {
          const columnType = columnData.type.toUpperCase();
          
          attributes[column] = {
            type: DataTypes[columnType] || DataTypes.STRING,
            allowNull: columnData.allowNull,
          };

          if (column === 'id') {
            attributes[column].primaryKey = true;
          }
        } else {
          attributes[column] = {
            type: DataTypes.STRING,
            allowNull: columnData.allowNull,
          };
        }
      }

      DynamicModel = sequelize.define(tableName, attributes, {
        tableName: tableName,
        timestamps: false,
      });
    }

    const offset = (page - 1) * limit; // Calculate offset for pagination
    const { count, rows } = await DynamicModel.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      total: count,
      rows,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
};

// Update a record in a table
const updateRecord = async (req, res) => {
  const { tableName, id } = req.params;
  const updatedFields = req.body;

  try {
    let DynamicModel;
    try {
      DynamicModel = sequelize.model(tableName);
    } catch (err) {
      return res.status(400).json({ message: 'Table not found' });
    }

    const [updated] = await DynamicModel.update(updatedFields, { where: { id } });

    if (updated) {
      res.status(200).json({ message: 'Record updated successfully' });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ message: 'Error updating record' });
  }
};

// Delete a record from a table
const deleteRecord = async (req, res) => {
  const { tableName, id } = req.params;

  try {
    let DynamicModel;
    try {
      DynamicModel = sequelize.model(tableName);
    } catch (err) {
      return res.status(400).json({ message: 'Table not found' });
    }

    const deleted = await DynamicModel.destroy({ where: { id } });

    if (deleted) {
      res.status(200).json({ message: 'Record deleted successfully' });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ message: 'Error deleting record' });
  }
};

// Fetch the list of dynamic tables
const fetchTableList = async (req, res) => {
  try {
    const tableList = await FileMetadata.findAll({
      attributes: ['tableName', 'originalFileName', 'uploadTime'],
      order: [['uploadTime', 'DESC']],  // Sort by latest uploads
    });

    res.status(200).json(tableList);
  } catch (error) {
    console.error('Error fetching table list:', error);
    res.status(500).json({ message: 'Error fetching table list' });
  }
};

module.exports = { uploadFile, fetchTableData, upload, updateRecord, deleteRecord, fetchTableList };
