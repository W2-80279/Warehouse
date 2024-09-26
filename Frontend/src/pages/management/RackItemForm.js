// src/pages/management/RackItemForm.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import { useRackItemContext } from './RackItemContext';
import RackItemTable from './RackItemTable';

const RackItemForm = () => {
  const { setRackItems } = useRackItemContext();
  const [racks, setRacks] = useState([]);
  const [items, setItems] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedRack, setSelectedRack] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [quantity, setQuantity] = useState('');
  const [dateStored, setDateStored] = useState('');
  const [labelGenerated, setLabelGenerated] = useState(false);
  const [materialCode, setMaterialCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [racksResponse, itemsResponse, slotsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/racks', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/items', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/rack-slots', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setRacks(racksResponse.data);
      setItems(itemsResponse.data.items);
      setSlots(slotsResponse.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!selectedItem || !selectedSlot || quantity <= 0) {
        alert('Please fill all required fields and ensure quantity is positive.');
        return;
      }

      const quantityNumber = Number(quantity);

      await axios.post('http://localhost:5000/api/rack-items', {
        itemId: selectedItem,
        rackSlotId: selectedSlot,
        quantityStored: quantityNumber,
        dateStored,
        labelGenerated,
        materialCode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Rack item added successfully!');
      const response = await axios.get('http://localhost:5000/api/rack-items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRackItems(response.data);
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding rack item:', error);
      alert(error.response?.data?.message || 'Error adding rack item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingItem) return;
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/rack-items/${editingItem.rackItemId}`, {
        itemId: selectedItem,
        rackSlotId: selectedSlot,
        quantityStored: quantity,
        dateStored,
        labelGenerated,
        materialCode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Rack item updated successfully!');
      const response = await axios.get('http://localhost:5000/api/rack-items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRackItems(response.data);
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating rack item', error);
      alert('Error updating rack item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (rackItemId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/rack-items/${rackItemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Rack item deleted successfully!');
      const response = await axios.get('http://localhost:5000/api/rack-items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRackItems(response.data);
    } catch (error) {
      console.error('Error deleting rack item', error);
      alert('Error deleting rack item');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleOpenEditDialog = (rackItem) => {
    setEditingItem(rackItem);
    setSelectedRack(rackItem.rackSlotId);
    setSelectedItem(rackItem.itemId);
    setSelectedSlot(rackItem.rackSlotId);
    setQuantity(rackItem.quantityStored);
    setDateStored(rackItem.dateStored);
    setLabelGenerated(rackItem.labelGenerated);
    setMaterialCode(rackItem.materialCode);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedRack('');
    setSelectedItem('');
    setSelectedSlot('');
    setQuantity('');
    setDateStored('');
    setLabelGenerated(false);
    setMaterialCode('');
  };

  const filteredSlots = slots.filter(slot => slot.rackId === parseInt(selectedRack));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ p: 3, flex: 1 }}>
        <Typography variant="h4" gutterBottom>
          Manage Rack Items
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ mb: 2 }}
        >
          Add Rack Item
        </Button>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Add Rack Item</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Rack</InputLabel>
              <Select
                value={selectedRack}
                onChange={(e) => setSelectedRack(e.target.value)}
                label="Rack"
              >
                {racks.map((rack) => (
                  <MenuItem key={rack.rackId} value={rack.rackId}>
                    {rack.rackCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel>Item</InputLabel>
              <Select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                label="Item"
              >
                {items.map((item) => (
                  <MenuItem key={item.itemId} value={item.itemId}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel>Slot</InputLabel>
              <Select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                label="Slot"
              >
                {filteredSlots.map((slot) => (
                  <MenuItem key={slot.id} value={slot.id}>
                    {slot.slotLabel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Quantity Stored"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              margin="dense"
            />

            <TextField
              label="Date Stored"
              type="date"
              value={dateStored}
              onChange={(e) => setDateStored(e.target.value)}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel>Label Generated</InputLabel>
              <Select
                value={labelGenerated}
                onChange={(e) => setLabelGenerated(e.target.value === 'true')}
                label="Label Generated"
              >
                <MenuItem value={false}>No</MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Material Code"
              value={materialCode}
              onChange={(e) => setMaterialCode(e.target.value)}
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Render your RackItemTable here */}
        <RackItemTable onEdit={handleOpenEditDialog} onDelete={handleDelete} />
      </Box>
    </Box>
  );
};

export default RackItemForm;
