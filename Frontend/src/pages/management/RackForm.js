// src/pages/management/RackForm.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const RackForm = () => {
  const [racks, setRacks] = useState([]);
  const [rack, setRack] = useState({ rackCode: '', description: '', capacity: '' });
  const [editingRackId, setEditingRackId] = useState(null);

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
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRack({ ...rack, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingRackId) {
        // Update existing rack
        await axios.put(`http://localhost:5000/api/racks/${editingRackId}`, rack, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Add new rack
        await axios.post('http://localhost:5000/api/racks', rack, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setRack({ rackCode: '', description: '', capacity: '' }); // Reset form
      setEditingRackId(null); // Reset editing state
      fetchRacks(); // Refresh the rack list
    } catch (error) {
      console.error('Error saving rack:', error);
    }
  };

  const handleEdit = (rack) => {
    setRack({ rackCode: rack.rackCode, description: rack.description, capacity: rack.capacity });
    setEditingRackId(rack.rackId);
  };

  const handleDelete = async (rackId) => {
    try {
      await axios.delete(`http://localhost:5000/api/racks/${rackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRacks(); // Refresh the rack list after deletion
    } catch (error) {
      console.error('Error deleting rack:', error);
    }
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
        />
        <Button type="submit" variant="contained" color="primary">
          {editingRackId ? 'Update Rack' : 'Add Rack'}
        </Button>
      </form>

      {/* Table of racks */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Rack Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Capacity</TableCell>
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
