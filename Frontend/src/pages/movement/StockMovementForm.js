import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const StockMovementForm = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [fromRack, setFromRack] = useState('');
  const [fromSlot, setFromSlot] = useState('');
  const [toRack, setToRack] = useState('');
  const [toSlot, setToSlot] = useState('');
  const [quantity, setQuantity] = useState(0);

  // Fetch items from the API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token'); // Replace with your method of storing the token
        const response = await axios.get('http://localhost:5000/api/items', {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request headers
          },
        });
        console.log(response.data); // Log the response to see the structure
        setItems(response.data.items);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  // Fetch item details when an item is selected
  const handleItemChange = async (event) => {
    const itemId = event.target.value;
    setSelectedItem(itemId);

    if (itemId) {
      try {
        const token = localStorage.getItem('token'); // Ensure the token is included
        const response = await axios.get(`http://localhost:5000/api/items/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request headers
          },
        });
        const itemDetails = response.data;

        // Log the entire item details response to see its structure
        console.log('Selected item details:', itemDetails);

        // Ensure the properties exist before assignment
        if (itemDetails.currentRackId && itemDetails.currentSlotId) {
          setFromRack(itemDetails.currentRackId); // Assuming you have currentRackId in item details
          setFromSlot(itemDetails.currentSlotId); // Assuming you have currentSlotId in item details
        } else {
          console.error('currentRackId or currentSlotId is undefined in the item details');
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Add your submit logic here (send data to the server)
    console.log({
      fromRack,
      fromSlot,
      toRack,
      toSlot,
      quantity,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="item-select-label">Select Item</InputLabel>
        <Select
          labelId="item-select-label"
          value={selectedItem}
          onChange={handleItemChange}
          required
        >
          {items.map(item => (
            <MenuItem key={item.itemId} value={item.itemId}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="From Rack"
        value={fromRack}
        disabled // Make it read-only since it auto-fills
        fullWidth
        margin="normal"
      />
      <TextField
        label="From Slot"
        value={fromSlot}
        disabled // Make it read-only since it auto-fills
        fullWidth
        margin="normal"
      />
      
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="to-rack-select-label">To Rack</InputLabel>
        <Select
          labelId="to-rack-select-label"
          value={toRack}
          onChange={(e) => setToRack(e.target.value)}
          required
        >
          {/* Populate your rack options here */}
          <MenuItem value="rack1">Rack 1</MenuItem>
          <MenuItem value="rack2">Rack 2</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="to-slot-select-label">To Slot</InputLabel>
        <Select
          labelId="to-slot-select-label"
          value={toSlot}
          onChange={(e) => setToSlot(e.target.value)}
          required
        >
          {/* Populate your slot options here */}
          <MenuItem value="slot1">Slot 1</MenuItem>
          <MenuItem value="slot2">Slot 2</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        fullWidth
        margin="normal"
        required
      />

      <Button type="submit" variant="contained" color="primary">
        Move Stock
      </Button>
    </form>
  );
};

export default StockMovementForm;
