const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = fileController.upload;

router.post('/upload', upload, fileController.uploadFile);
router.get('/data/:tableName', fileController.fetchTableData);
router.put('/data/:tableName/:id', fileController.updateRecord);
router.delete('/data/:tableName/:id', fileController.deleteRecord);
router.get('/tables', fileController.fetchTableList);  // New route to fetch table list

module.exports = router;
