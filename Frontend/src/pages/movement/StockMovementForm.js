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
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [selectedSlotCurrentCapacity, setSelectedSlotCurrentCapacity] = useState(0);
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
        setAllSlots(response.data);
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };

    fetchSlots();
  }, [token]);

  // Set available quantity based on the selected item
  useEffect(() => {
    if (selectedItem) {
      setAvailableQuantity(selectedItem.quantityStored || 0);
    }
  }, [selectedItem]);

  const fetchSlotCurrentCapacity = (rackId, slotLabel) => {
    const selectedSlot = allSlots.find(slot => slot.rackId === rackId && slot.slotLabel === slotLabel);
    if (selectedSlot) {
      setSelectedSlotCurrentCapacity(selectedSlot.currentCapacity);
    } else {
      setSelectedSlotCurrentCapacity(0); // Reset if not found
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const targetSlot = slots.find(slot => slot.slotLabel === toSlotLabel);
    if (!targetSlot) {
      console.error('Target slot not found');
      return;
    }

    const movementData = {
      rackItemId: selectedItem.rackItemId,
      fromRackId: fromRackId,
      fromSlotId: fromSlotId,
      toRackId: toRackId,
      toSlotId: targetSlot.id,
      quantity: quantity,
      movementDate: new Date().toISOString(),
      movedBy: userId,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/stock-movements', movementData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log('Stock moved successfully', response.data);
      onClose();
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
              onChange={(e) => {
                const selectedRackId = e.target.value;
                setToRackId(selectedRackId);
                setToSlotLabel(''); // Reset slot label when rack changes
                setSlots(allSlots.filter(slot => slot.rackId === selectedRackId)); // Filter slots based on selected rack
              }}
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
              onChange={(e) => {
                const selectedLabel = e.target.value;
                setToSlotLabel(selectedLabel);
                fetchSlotCurrentCapacity(toRackId, selectedLabel); // Pass both rack ID and slot label
              }}
              required
            >
              {slots.map((slot) => (
                <MenuItem key={slot.id} value={slot.slotLabel}>
                  {slot.slotLabel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body1" color="textSecondary" style={{ marginTop: 16 }}>
            Available Slot Capacity: {selectedSlotCurrentCapacity}
          </Typography>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            required
            inputProps={{ min: 1, max: availableQuantity }} // Limit to available quantity
          />
          <DialogActions>
            <Button onClick={onClose} color="secondary">Cancel</Button>
            <Button type="submit" color="primary">Move Stock</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StockMovementForm;
