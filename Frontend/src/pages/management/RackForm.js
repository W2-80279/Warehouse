import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Select, MenuItem } from '@mui/material';
import { Alert } from '@mui/material';
import axios from 'axios';

const RackForm = () => {
  const [racks, setRacks] = useState([]);
  const [rack, setRack] = useState({ rackCode: '', description: '', capacity: '', isActive: true });
  const [editingRackId, setEditingRackId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRacks();
  }, []);

  const fetchRacks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/racks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRacks(response.data);
    } catch (error) {
      console.error('Error fetching racks:', error);
      showSnackbar('Error fetching racks', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRack({ ...rack, [name]: name === 'isActive' ? value === 'true' : value }); // Convert string to boolean for isActive
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingRackId) {
        // Update existing rack
        await axios.put(`http://localhost:5000/api/racks/${editingRackId}`, rack, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSnackbar('Rack updated successfully', 'success');
      } else {
        // Add new rack
        await axios.post('http://localhost:5000/api/racks', rack, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSnackbar('Rack added successfully', 'success');
      }
      resetForm();
      fetchRacks(); // Refresh the rack list
    } catch (error) {
      console.error('Error saving rack:', error);
      showSnackbar('Error saving rack', 'error');
    }
  };

  const resetForm = () => {
    setRack({ rackCode: '', description: '', capacity: '', isActive: true }); // Reset form
    setEditingRackId(null); // Reset editing state
  };

  const handleEdit = (rack) => {
    setRack({ rackCode: rack.rackCode, description: rack.description, capacity: rack.capacity, isActive: rack.isActive });
    setEditingRackId(rack.rackId);
  };

  const handleDelete = async (rackId) => {
    try {
      await axios.delete(`http://localhost:5000/api/racks/${rackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSnackbar('Rack deleted successfully', 'success');
      fetchRacks(); // Refresh the rack list after deletion
    } catch (error) {
      console.error('Error deleting rack:', error);
      showSnackbar('Error deleting rack', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Rack Code"
          name="rackCode"
          value={rack.rackCode}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={rack.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Capacity"
          name="capacity"
          value={rack.capacity}
          onChange={handleInputChange}
          type="number"
          fullWidth
          margin="normal"
          required
          inputProps={{ min: 1 }}
        />
        <Select
          label="Is Active"
          name="isActive"
          value={rack.isActive ? 'true' : 'false'} // Convert boolean to string for Select
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        >
          <MenuItem value="true">Yes</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </Select>
        <Button type="submit" variant="contained" color="primary">
          {editingRackId ? 'Update Rack' : 'Add Rack'}
        </Button>
      </form>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Table of racks */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Rack Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Is Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {racks.map((rack) => (
              <TableRow key={rack.rackId}>
                <TableCell>{rack.rackId}</TableCell>
                <TableCell>{rack.rackCode}</TableCell>
                <TableCell>{rack.description}</TableCell>
                <TableCell>{rack.capacity}</TableCell>
                <TableCell>{rack.isActive ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEdit(rack)}
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(rack.rackId)}
                    variant="contained"
                    color="secondary"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RackForm;
