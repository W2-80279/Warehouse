import React, { useState, useEffect } from 'react';
import {
  TextField, Button, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Snackbar, Alert, Box,
  Typography, useMediaQuery
} from '@mui/material';
import axios from 'axios';

const RackSlotForm = () => {
  const [rackSlots, setRackSlots] = useState([]);
  const [rackSlot, setRackSlot] = useState({ slotLabel: '', slotCapacity: '', currentCapacity: '', rackId: '' });
  const [racks, setRacks] = useState([]);
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [availableCapacity, setAvailableCapacity] = useState(0); // To display near "Add Slot" button

  const token = localStorage.getItem('token');
  
  // Responsive logic
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    fetchRackSlots();
    fetchRacks();
  }, []);

  const fetchRackSlots = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rack-slots', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRackSlots(response.data);
    } catch (error) {
      console.error('Error fetching rack slots:', error);
      showSnackbar('Error fetching rack slots', 'error');
    }
  };

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

  const fetchAvailableCapacity = async (rackId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/racks/${rackId}/available-capacity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableCapacity(response.data.availableCapacity);
    } catch (error) {
      console.error('Error fetching available capacity:', error);
      showSnackbar('Error fetching available capacity', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRackSlot({ ...rackSlot, [name]: value });

    // Fetch available capacity when a rack is selected
    if (name === 'rackId') {
      fetchAvailableCapacity(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSlotId) {
        await axios.put(`http://localhost:5000/api/rack-slots/${editingSlotId}`, rackSlot, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSnackbar('Rack slot updated successfully', 'success');
      } else {
        // Check for available capacity when adding a new slot
        const response = await axios.post('http://localhost:5000/api/rack-slots', rackSlot, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableCapacity(response.data.remainingCapacity); // Update available capacity
        showSnackbar('Rack slot added successfully', 'success');
      }
      resetForm();
      fetchRackSlots(); // Refresh the rack slot list
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle not enough capacity
        showSnackbar(`Not enough space. Remaining capacity: ${error.response.data.remainingCapacity}`, 'error');
      } else {
        console.error('Error saving rack slot:', error);
        showSnackbar('Error saving rack slot', 'error');
      }
    }
  };

  const resetForm = () => {
    setRackSlot({ slotLabel: '', slotCapacity: '', currentCapacity: '', rackId: '' });
    setEditingSlotId(null);
    setAvailableCapacity(0); // Reset available capacity
  };

  const handleEdit = (slot) => {
    setRackSlot({
      slotLabel: slot.slotLabel,
      slotCapacity: slot.slotCapacity,
      currentCapacity: slot.currentCapacity,
      rackId: slot.rackId,
    });
    setEditingSlotId(slot.id);
    fetchAvailableCapacity(slot.rackId); // Fetch available capacity for the selected rack
  };

  const handleDelete = async (slotId) => {
    try {
      await axios.delete(`http://localhost:5000/api/rack-slots/${slotId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSnackbar('Rack slot deleted successfully', 'success');
      fetchRackSlots(); // Refresh the rack slot list
    } catch (error) {
      console.error('Error deleting rack slot:', error);
      showSnackbar('Error deleting rack slot', 'error');
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
      <Typography variant="h4" gutterBottom>
        Rack Slot Management
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Slot Label"
          name="slotLabel"
          value={rackSlot.slotLabel}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Slot Capacity"
          name="slotCapacity"
          value={rackSlot.slotCapacity}
          onChange={handleInputChange}
          type="number"
          fullWidth
          margin="normal"
          required
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Current Capacity"
          name="currentCapacity"
          value={rackSlot.currentCapacity}
          onChange={handleInputChange}
          type="number"
          fullWidth
          margin="normal"
          required
          inputProps={{ min: 0 }}
        />
        <TextField
          label="Rack"
          name="rackId"
          value={rackSlot.rackId}
          onChange={handleInputChange}
          select
          fullWidth
          margin="normal"
          required
        >
          {racks.map((rack) => (
            <MenuItem key={rack.rackId} value={rack.rackId}>
              {rack.rackCode}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            {editingSlotId ? 'Update Slot' : 'Add Slot'}
          </Button>

          {/* Transparent Box showing available capacity */}
          <Box
            sx={{
              marginLeft: 2,
              padding: 1,
              border: '1px solid rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              fontSize: '0.9em',
              color: 'gray',
            }}
          >
            Available Capacity: {availableCapacity}
          </Box>
        </Box>
      </form>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Table of rack slots */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Rack Code</TableCell>
              <TableCell>Slot Label</TableCell>
              <TableCell>Slot Capacity</TableCell>
              <TableCell>Available Capacity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rackSlots.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell>{slot.id}</TableCell>
                <TableCell>{slot.Rack.rackCode}</TableCell>
                <TableCell>{slot.slotLabel}</TableCell>
                <TableCell>{slot.slotCapacity}</TableCell>
                <TableCell>{slot.currentCapacity}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEdit(slot)}
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(slot.id)}
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

export default RackSlotForm;
