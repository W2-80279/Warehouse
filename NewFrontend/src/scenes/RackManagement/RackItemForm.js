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
import { useDispatch } from 'react-redux';
import { setRackItems } from './../../features/rackItemSlice'; // Adjust the import path according to your file structure
import RackItemTable from './RackItemTable';
import Autocomplete from '@mui/material/Autocomplete'; // Ensure you are importing from '@mui/material'
import { useTheme } from '@mui/material/styles'; // Import useTheme for theming

const RackItemForm = () => {
  const dispatch = useDispatch();
  const theme = useTheme(); // Use theme for styling
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
        setLoading(false);
        return;
      }

      const quantityNumber = Number(quantity);
      if (isNaN(quantityNumber) || quantityNumber <= 0) {
        alert('Quantity must be a valid positive number.');
        setLoading(false);
        return;
      }

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

      const response = await axios.get('http://localhost:5000/api/rack-items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(setRackItems(response.data)); // Dispatching action to Redux store
      handleCloseDialog();
      alert('Rack item added successfully!');
    } catch (error) {
      console.error('Error adding rack item:', error);
      alert(error.response?.data?.message || 'Error adding rack item');
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
      dispatch(setRackItems(response.data)); // Dispatching action to Redux store
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
    <Box sx={{  flexDirection: 'column', height: '100vh', p: 3, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
        Manage Rack Items
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpenDialog} // Opens the dialog to add a new rack item
        sx={{ mb: 2 }}
      >
        Add Rack Item
      </Button>

      {/* Dialog for Adding Rack Item */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ color: theme.palette.text.primary }}>Add Rack Item</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel sx={{ color: theme.palette.text.primary }}>Rack</InputLabel>
            <Select
              value={selectedRack}
              onChange={(e) => setSelectedRack(e.target.value)} // Set selected rack
              label="Rack"
              sx={{ color: theme.palette.text.primary }}
            >
              {racks.map((rack) => (
                <MenuItem key={rack.rackId} value={rack.rackId}>
                  {rack.rackCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Autocomplete
            options={items}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => setSelectedItem(newValue?.itemId || '')} // Set selected item ID
            renderInput={(params) => (
              <TextField {...params} label="Item" variant="outlined" fullWidth margin="dense" />
            )}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel sx={{ color: theme.palette.text.primary }}>Slot</InputLabel>
            <Select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              label="Slot"
              sx={{ color: theme.palette.text.primary }}
            >
              {filteredSlots.map((slot) => (
                <MenuItem key={slot.id} value={slot.id}>
                  {slot.slotLabel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Date Stored"
            type="date"
            value={dateStored}
            onChange={(e) => setDateStored(e.target.value)}
            fullWidth
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Material Code"
            value={materialCode}
            onChange={(e) => setMaterialCode(e.target.value)}
            fullWidth
            margin="dense"
          />

          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* RackItemTable Component */}
      <RackItemTable
        items={items}
        onEdit={handleOpenEditDialog}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default RackItemForm;
