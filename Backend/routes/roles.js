// 
const express = require('express');
const router = express.Router();
const { getAllRoles, getRoleById, createRole, updateRole, deleteRole } = require('../controllers/RoleController');

// Routes without authentication or authorization
router.get('/', getAllRoles); // No authentication required
router.get('/:id', getRoleById); // No authentication required
router.post('/', createRole); // No authentication required
router.put('/:id', updateRole); // No authentication required
router.delete('/:id', deleteRole); // No authentication required

module.exports = router;
