import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const RackSlotForm = () => {
  const [rackSlots, setRackSlots] = useState([]);
  const [rackSlot, setRackSlot] = useState({ slotLabel: '', slotCapacity: '', currentCapacity: '', rackId: '' });
  const [racks, setRacks] = useState([]);
  const [editingSlotId, setEditingSlotId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRackSlots();
    fetchRacks();
  }, []);

  // Fetch rack slots from API
  const fetchRackSlots = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rack-slots', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRackSlots(response.data);
    } catch (error) {
      console.error('Error fetching rack slots:', error);
    }
  };

  // Fetch racks for the dropdown
  const fetchRacks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/racks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRacks(response.data);
    } catch (error) {
      console.error('Error fetching racks:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRackSlot({ ...rackSlot, [name]: value });
  };

  // Handle form submission (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSlotId) {
        // Update rack slot
        await axios.put(`http://localhost:5000/api/rack-slots/${editingSlotId}`, rackSlot, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Add new rack slot
        await axios.post('http://localhost:5000/api/rack-slots', rackSlot, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setRackSlot({ slotLabel: '', slotCapacity: '', currentCapacity: '', rackId: '' }); // Reset form
      setEditingSlotId(null); // Reset editing state
      fetchRackSlots(); // Refresh the rack slot list
    } catch (error) {
      console.error('Error saving rack slot:', error);
    }
  };

  // Handle edit
  const handleEdit = (slot) => {
    setRackSlot({
      slotLabel: slot.slotLabel,
      slotCapacity: slot.slotCapacity,
      currentCapacity: slot.currentCapacity,
      rackId: slot.rackId,
    });
    setEditingSlotId(slot.id);
  };

  // Handle delete
  const handleDelete = async (slotId) => {
    try {
      await axios.delete(`http://localhost:5000/api/rack-slots/${slotId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRackSlots(); // Refresh the rack slot list
    } catch (error) {
      console.error('Error deleting rack slot:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Slot Label"
          name="slotLabel"
          value={rackSlot.slotLabel}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Slot Capacity"
          name="slotCapacity"
          value={rackSlot.slotCapacity}
          onChange={handleInputChange}
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Current Capacity"
          name="currentCapacity"
          value={rackSlot.currentCapacity}
          onChange={handleInputChange}
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Rack"
          name="rackId"
          value={rackSlot.rackId}
          onChange={handleInputChange}
          select
          fullWidth
          margin="normal"
        >
          {racks.map((rack) => (
            <MenuItem key={rack.rackId} value={rack.rackId}>
              {rack.rackCode}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary">
          {editingSlotId ? 'Update Slot' : 'Add Slot'}
        </Button>
      </form>

      {/* Table of rack slots */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Rack Code</TableCell>
              <TableCell>Slot Label</TableCell>
              <TableCell>Slot Capacity</TableCell>
              <TableCell>Current Capacity</TableCell>
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
