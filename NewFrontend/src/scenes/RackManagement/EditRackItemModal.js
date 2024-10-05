// src/pages/management/EditRackItemModal.js
import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import axios from 'axios';

const EditRackItemModal = ({ open, onClose, rackItem, onSave }) => {
  const [item, setItem] = useState({}); // Initialize with an empty object

  useEffect(() => {
    // Reset the form when the modal opens with a new rackItem
    if (rackItem) {
      setItem(rackItem);
    }
  }, [rackItem]);

  const handleChange = (field, value) => {
    setItem(prevItem => ({ ...prevItem, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Ensure quantityStored is a number
      const updatedItem = {
        ...item,
        quantityStored: Number(item.quantityStored), // Ensure it's a number
      };

      // Save the changes to the backend via API call
      await axios.put(`http://localhost:5000/api/rack-items/${item.rackItemId}`, updatedItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      onSave(updatedItem); // Trigger the save callback to update the table
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error('Error saving item', error);
      alert('Error saving item: ' + (error.response?.data?.message || 'An error occurred')); // Provide feedback on error
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Rack Item</DialogTitle>
      <DialogContent>
        <TextField
          label="Item Name"
          value={item.Item?.name || ''}
          onChange={(e) => handleChange('Item', { ...item.Item, name: e.target.value })}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Rack Slot"
          value={item.RackSlot?.slotLabel || ''}
          onChange={(e) => handleChange('RackSlot', { ...item.RackSlot, slotLabel: e.target.value })}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Quantity Stored"
          type="number"
          value={item.quantityStored || ''}
          onChange={(e) => handleChange('quantityStored', e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Date Stored"
          type="date"
          value={item.dateStored?.split('T')[0] || ''}
          onChange={(e) => handleChange('dateStored', e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Material Code"
          value={item.materialCode || ''}
          onChange={(e) => handleChange('materialCode', e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Label Generated"
          select
          value={item.labelGenerated ? 'Yes' : 'No'} // Change to select field for better UX
          onChange={(e) => handleChange('labelGenerated', e.target.value === 'Yes')}
          fullWidth
          margin="dense"
          SelectProps={{
            native: true,
          }}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </TextField>
        {/* Add other fields here as necessary */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRackItemModal;
