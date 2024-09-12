import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import StockMovementList from './StockMovementList';

const StockMovementForm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [items, setItems] = useState([]);
  const [racks, setRacks] = useState([]);
  const [slots, setSlots] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [sourceRack, setSourceRack] = useState('');
  const [sourceSlot, setSourceSlot] = useState('');
  const [destinationRack, setDestinationRack] = useState('');
  const [destinationSlot, setDestinationSlot] = useState('');
  const [quantity, setQuantity] = useState('');
  const [movementDate, setMovementDate] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsResponse, racksResponse, slotsResponse, usersResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/items', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/racks', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/rack-slots', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/auth/users', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setItems(itemsResponse.data);
      setRacks(racksResponse.data);
      setSlots(slotsResponse.data);
      setUsers(usersResponse.data);
      setError('');
    } catch (error) {
      setError('Error fetching data');
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleMovement = async () => {
    if (!selectedItem || !sourceRack || !sourceSlot || !destinationRack || !destinationSlot || !quantity || !movementDate) {
      setError('All fields are required');
      console.log('Validation failed. Request data:', {
        selectedItem,
        sourceRack,
        sourceSlot,
        destinationRack,
        destinationSlot,
        quantity,
        movementDate
      });
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const requestData = {
      itemId: selectedItem,
      fromRackId: sourceRack,
      fromSlotId: sourceSlot,
      toRackId: destinationRack,
      toSlotId: destinationSlot,
      quantity,
      movementDate,
      movedBy: 1 // Assuming the user ID is 1
    };

    console.log('Request Data:', requestData); // Log the request data

    try {
      const response = await axios.post('http://localhost:5000/api/stock-movements', requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Response Data:', response.data); // Log the response data
      setSuccess('Stock movement created successfully');
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      console.error('Error moving stock', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.error : 'Error moving stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog(true)}
        disabled={loading}
      >
        Move Stock
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Move Stock</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          {loading && <CircularProgress />}

          <FormControl fullWidth margin="dense">
            <InputLabel>Item</InputLabel>
            <Select
              value={selectedItem || ''}
              onChange={(e) => setSelectedItem(e.target.value)}
              disabled={loading}
            >
              {items.map(item => (
                <MenuItem key={item.itemId} value={item.itemId}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Source Rack</InputLabel>
            <Select
              value={sourceRack || ''}
              onChange={(e) => {
                const newRackId = e.target.value;
                setSourceRack(newRackId);
                setSourceSlot(''); // Reset source slot when rack changes
              }}
              disabled={loading}
            >
              {racks.map(rack => (
                <MenuItem key={rack.rackId} value={rack.rackId}>
                  {rack.rackCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Source Slot</InputLabel>
            <Select
              value={sourceSlot || ''}
              onChange={(e) => setSourceSlot(e.target.value)}
              disabled={loading}
            >
              {slots.filter(slot => slot.rackId === sourceRack).map(slot => (
                <MenuItem key={slot.id} value={slot.id}>
                  {slot.slotLabel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Destination Rack</InputLabel>
            <Select
              value={destinationRack || ''}
              onChange={(e) => {
                const newRackId = e.target.value;
                setDestinationRack(newRackId);
                setDestinationSlot(''); // Reset destination slot when rack changes
              }}
              disabled={loading}
            >
              {racks.map(rack => (
                <MenuItem key={rack.rackId} value={rack.rackId}>
                  {rack.rackCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Destination Slot</InputLabel>
            <Select
              value={destinationSlot || ''}
              onChange={(e) => setDestinationSlot(e.target.value)}
              disabled={loading}
            >
              {slots.filter(slot => slot.rackId === destinationRack).map(slot => (
                <MenuItem key={slot.id} value={slot.id}>
                  {slot.slotLabel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            margin="dense"
            disabled={loading}
          />

          <TextField
            label="Movement Date"
            type="date"
            value={movementDate}
            onChange={(e) => setMovementDate(e.target.value)}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleMovement} color="primary" disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Box>
        <StockMovementList />
      </Box>
    </Box>
  );
};

export default StockMovementForm;
