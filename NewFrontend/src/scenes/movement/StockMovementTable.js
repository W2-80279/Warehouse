import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material';
import axios from 'axios';

const StockMovementTable = () => {
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState({}); // Store item details
  const [racks, setRacks] = useState({}); // Store rack details
  const [rackSlots, setRackSlots] = useState({}); // Store rack slot details
  const token = localStorage.getItem('token'); // Assuming you still need the token for authorization
  const theme = useTheme();

  // Fetch stock movements from the API
  useEffect(() => {
    const fetchStockMovements = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stock-movements', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setStockMovements(data);
        fetchAdditionalDetails(data); // Fetch additional details after getting stock movements
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockMovements();
  }, [token]);

  // Fetch item, rack, and rack slot details based on the stock movements
  const fetchAdditionalDetails = (movements) => {
    const itemIds = new Set(movements.map(m => m.RackItem.itemId));
    const rackIds = new Set(movements.flatMap(m => [m.fromRackId, m.toRackId]));
    const slotIds = new Set(movements.flatMap(m => [m.fromSlotId, m.toSlotId]));

    // Fetch item details
    itemIds.forEach(async (id) => {
      const response = await axios.get(`http://localhost:5000/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => ({ ...prev, [id]: response.data }));
    });

    // Fetch rack details
    rackIds.forEach(async (id) => {
      const response = await axios.get(`http://localhost:5000/api/racks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRacks((prev) => ({ ...prev, [id]: response.data }));
    });

    // Fetch rack slot details
    slotIds.forEach(async (id) => {
      const response = await axios.get(`http://localhost:5000/api/rack-slots/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRackSlots((prev) => ({ ...prev, [id]: response.data }));
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
      >
        Stock Movement Table
      </Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
        {loading && <CircularProgress />}
        {error && <div>Error: {error}</div>}
        {!loading && !error && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>Movement ID</TableCell>
                <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>Item Name</TableCell>
                <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>From Rack Code</TableCell>
                <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>From Slot Label</TableCell>
                <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>To Rack Code</TableCell>
                <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>To Slot Label</TableCell>
                <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>Quantity</TableCell>
                <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>Movement Date</TableCell>
                <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>Moved By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockMovements.map((movement) => (
                <TableRow key={movement.movementId}>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    {movement.movementId || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    {items[movement.RackItem?.itemId]?.name || 'Loading...'}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    {racks[movement.fromRackId]?.rackCode || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    {rackSlots[movement.fromSlotId]?.slotLabel || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    {racks[movement.toRackId]?.rackCode || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    {rackSlots[movement.toSlotId]?.slotLabel || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    {movement.quantity || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    {new Date(movement.movementDate).toLocaleString() || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                    {movement.movedBy || 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default StockMovementTable;
