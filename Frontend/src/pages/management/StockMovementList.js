import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const StockMovementList = () => {
  const [stockMovements, setStockMovements] = useState([]);

  useEffect(() => {
    fetchStockMovements();
  }, []);

  const fetchStockMovements = async () => {
    try {
      // Retrieve the token from local storage or any other secure place
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:5000/api/stock-movements', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setStockMovements(response.data);
    } catch (error) {
      console.error('Error fetching stock movements:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Movement ID</TableCell>
            <TableCell>Item ID</TableCell>
            <TableCell>From Rack ID</TableCell>
            <TableCell>From Slot Label</TableCell>
            <TableCell>To Rack ID</TableCell>
            <TableCell>To Slot Label</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Movement Date</TableCell>
            <TableCell>Moved By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockMovements.map((movement) => (
            <TableRow key={movement.movementId}>
              <TableCell>{movement.movementId}</TableCell>
              <TableCell>{movement.itemId}</TableCell>
              <TableCell>{movement.fromRackId}</TableCell>
              <TableCell>{movement.fromSlotLabel}</TableCell>
              <TableCell>{movement.toRackId}</TableCell>
              <TableCell>{movement.toSlotLabel}</TableCell>
              <TableCell>{movement.quantity}</TableCell>
              <TableCell>{new Date(movement.movementDate).toLocaleDateString()}</TableCell>
              <TableCell>{movement.movedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockMovementList;
