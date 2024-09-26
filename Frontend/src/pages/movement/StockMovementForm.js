import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useRackItemContext } from './RackItemContext';

const StockMovementForm = ({ open, onClose, selectedItem, fromRackId, fromSlotLabel, fromSlotId }) => {
  const { setRackItems } = useRackItemContext();
  const [toRackId, setToRackId] = useState('');
  const [toSlotLabel, setToSlotLabel] = useState('');
  const [quantity, setQuantity] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState(0); // To hold the available quantity
  const [racks, setRacks] = useState([]);
  const [slots, setSlots] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const token = localStorage.getItem('token');
  const userId = 1; // Replace with the actual user ID if available.

  // Fetch racks and slots
  useEffect(() => {
    const fetchRacks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/racks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched Racks:", response.data); // Debugging log
        setRacks(response.data);
      } catch (error) {
        console.error('Error fetching racks:', error);
      }
    };

    fetchRacks();
  }, [token]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rack-slots', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched Slots:", response.data); // Debugging log
        setAllSlots(response.data);
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };

    fetchSlots();
  }, [token]);

  // Filter slots based on selected rack
  useEffect(() => {
    if (toRackId) {
      const filteredSlots = allSlots.filter(slot => slot.rackId === toRackId);
      console.log("Filtered Slots:", filteredSlots); // Debugging log
      setSlots(filteredSlots);
    } else {
      setSlots([]);
    }
  }, [toRackId, allSlots]);

  // Set available quantity based on the selected item
  useEffect(() => {
    if (selectedItem) {
      setAvailableQuantity(selectedItem.quantity); // Adjust this to match the property for the quantity in your data
    }
  }, [selectedItem]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Find the target slot based on the selected slot label
    const targetSlot = slots.find(slot => slot.slotLabel === toSlotLabel);
    
    if (!targetSlot) {
      console.error('Target slot not found');
      return;
    }

    // Prepare the movement data
    const movementData = {
      rackItemId: selectedItem.rackItemId, // Automatically fetch the rackItemId from selectedItem
      fromRackId: fromRackId,
      fromSlotId: fromSlotId,
      toRackId: toRackId,
      toSlotId: targetSlot.id, // Use the actual ID from the selected slot
      quantity: quantity,
      movementDate: new Date().toISOString(),
      movedBy: userId, // Ensure this is your actual user ID
    };

    try {
      const response = await axios.post('http://localhost:5000/api/stock-movements', movementData, {
        headers: {
          'Authorization': `Bearer ${token}`, // Add your token here
          'Content-Type': 'application/json',
        }
      });
      console.log('Stock moved successfully', response.data);
      // Optionally, reset the form or update the context here
      onClose(); // Close the dialog after successful submission
    } catch (error) {
      console.error('Error moving stock:', error.response?.data || error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Move Stock</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Item Name"
            value={selectedItem.Item?.name || ''}
            fullWidth
            disabled
          />
          <TextField
            label="From Rack"
            value={fromRackId}
            fullWidth
            disabled
          />
          <TextField
            label="From Slot"
            value={fromSlotLabel}
            fullWidth
            disabled
          />
          <Typography variant="body1" color="textSecondary" style={{ marginTop: 16 }}>
            Available Quantity: {availableQuantity}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="to-rack-label">To Rack</InputLabel>
            <Select
              labelId="to-rack-label"
              value={toRackId}
              onChange={(e) => setToRackId(e.target.value)}
              required
            >
              {racks.map((rack) => (
                <MenuItem key={rack.rackId} value={rack.rackId}>
                  {rack.rackCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="to-slot-label">To Slot</InputLabel>
            <Select
              labelId="to-slot-label"
              value={toSlotLabel}
              onChange={(e) => setToSlotLabel(e.target.value)}
              required
            >
              {slots.map((slot) => (
                <MenuItem key={slot.id} value={slot.slotLabel}>
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
            required
            inputProps={{ min: 1, max: availableQuantity }} // Set max to available quantity
          />
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Move Stock
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StockMovementForm;
