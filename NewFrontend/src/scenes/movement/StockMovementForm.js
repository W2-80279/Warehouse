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
  Box,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRacks, fetchSlots, moveStock } from '../../features/movementSlice';
import { selectRacks, selectAllSlots, selectLoading, selectError } from '../../features/movementSlice';

const StockMovementForm = ({ open, onClose, selectedItem, fromRackId, fromSlotLabel, fromSlotId }) => {
  const dispatch = useDispatch();
  const racks = useSelector(selectRacks);
  const allSlots = useSelector(selectAllSlots);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [toRackId, setToRackId] = useState('');
  const [toSlotLabel, setToSlotLabel] = useState('');
  const [quantity, setQuantity] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [selectedSlotCurrentCapacity, setSelectedSlotCurrentCapacity] = useState(0);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const token = localStorage.getItem('token');
  const userId = 1; // Replace with the actual user ID if available.

  // Fetch racks and slots using Redux actions
  useEffect(() => {
    dispatch(fetchRacks(token));
    dispatch(fetchSlots(token));
  }, [dispatch, token]);

  // Set available quantity based on the selected item
  useEffect(() => {
    if (selectedItem) {
      setAvailableQuantity(selectedItem.quantityStored || 0);
    }
  }, [selectedItem]);

  // Filter slots based on selected rack
  useEffect(() => {
    if (toRackId) {
      const filtered = allSlots.filter(slot => slot.rackId === toRackId);
      setFilteredSlots(filtered);
    }
  }, [toRackId, allSlots]);

  const fetchSlotCurrentCapacity = (rackId, slotLabel) => {
    const selectedSlot = allSlots.find(slot => slot.rackId === rackId && slot.slotLabel === slotLabel);
    if (selectedSlot) {
      setSelectedSlotCurrentCapacity(selectedSlot.currentCapacity);
    } else {
      setSelectedSlotCurrentCapacity(0);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const targetSlot = filteredSlots.find(slot => slot.slotLabel === toSlotLabel);
    if (!targetSlot) {
      console.error('Target slot not found');
      return;
    }

    // Validate quantity
    if (parseInt(quantity) > availableQuantity) {
      alert(`Quantity cannot exceed available quantity (${availableQuantity}).`);
      return;
    }

    if (parseInt(quantity) > selectedSlotCurrentCapacity) {
      alert(`Quantity cannot exceed selected slot capacity (${selectedSlotCurrentCapacity}).`);
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

    // Dispatch moveStock action
    dispatch(moveStock(movementData));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color:theme.palette.text.primary, textAlign: 'center' }}>
        Move Stock
      </DialogTitle>
      <DialogContent sx={{ padding: theme.spacing(3) }}>
        <form onSubmit={handleSubmit}>
          {/* Item Name Field - Positioned Higher */}
          <TextField
            label="Item Name"
            value={selectedItem.Item?.name || ''}
            fullWidth
            disabled
            sx={{ marginTop: theme.spacing(2) ,marginBottom: theme.spacing(2)}}
            variant="outlined"
          />

          {/* Racks and Slots */}
          <TextField
            label="From Rack"
            value={fromRackId}
            fullWidth
            disabled
            sx={{ marginBottom: theme.spacing(2) }}
            variant="outlined"
          />
          <TextField
            label="From Slot"
            value={fromSlotLabel}
            fullWidth
            disabled
            sx={{ marginBottom: theme.spacing(2) }}
            variant="outlined"
          />

          {/* Available Quantity and Slot Capacity - Right Aligned and Smaller */}
          <Grid container spacing={2} sx={{ marginBottom: theme.spacing(2) }}>
            <Grid item xs={6}>
              <Box
                sx={{
                  backgroundColor: theme.palette.background.default,
                  padding: theme.spacing(1),
                  borderRadius: '8px',
                  boxShadow: 1,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body1" color={theme.palette.text.primary}>
                  Available Quantity: {availableQuantity}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  backgroundColor: theme.palette.background.default,
                  padding: theme.spacing(1),
                  borderRadius: '8px',
                  boxShadow: 1,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body1" color={theme.palette.text.primary}>
                  Available Slot Capacity: {selectedSlotCurrentCapacity}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* To Rack and Slot */}
          <FormControl fullWidth variant="outlined" sx={{ marginBottom: theme.spacing(2) }}>
            <InputLabel id="to-rack-label">To Rack</InputLabel>
            <Select
              labelId="to-rack-label"
              value={toRackId}
              onChange={(e) => {
                const selectedRackId = e.target.value;
                setToRackId(selectedRackId);
                setToSlotLabel('');
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

          <FormControl fullWidth variant="outlined" sx={{ marginBottom: theme.spacing(2) }}>
            <InputLabel id="to-slot-label">To Slot</InputLabel>
            <Select
              labelId="to-slot-label"
              value={toSlotLabel}
              onChange={(e) => {
                const selectedLabel = e.target.value;
                setToSlotLabel(selectedLabel);
                fetchSlotCurrentCapacity(toRackId, selectedLabel);
              }}
              required
            >
              {filteredSlots.map((slot) => (
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
            inputProps={{ min: 1 }}
            variant="outlined"
            sx={{ marginBottom: theme.spacing(2) }}
          />
          <DialogActions>
            <Button onClick={onClose} color="secondary">Cancel</Button>
            <Button type="submit" color="dark" disabled={loading}>Move Stock</Button>
          </DialogActions>
          {error && <Typography color="error" sx={{ marginTop: theme.spacing(2) }}>{error}</Typography>}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StockMovementForm;
