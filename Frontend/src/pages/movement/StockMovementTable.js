import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';

const StockMovementTable = () => {
  const [stockMovements, setStockMovements] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch stock movements
  useEffect(() => {
    const fetchStockMovements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stock-movements', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched Stock Movements:", response.data); // Debugging log
        setStockMovements(response.data);
      } catch (error) {
        console.error('Error fetching stock movements:', error);
      }
    };

    fetchStockMovements();
  }, [token]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Movement Date</TableCell>
            <TableCell>Item Name</TableCell>
            <TableCell>From Rack Code</TableCell>
            <TableCell>From Slot Label</TableCell>
            <TableCell>To Rack Code</TableCell>
            <TableCell>To Slot Label</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Moved By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockMovements.map((movement) => (
            <TableRow key={movement.movementId}>
              <TableCell>
                {new Date(movement.movementDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{movement.Item?.name || 'N/A'}</TableCell>
              <TableCell>{movement.fromRackCode}</TableCell>
              <TableCell>{movement.fromSlotLabel}</TableCell>
              <TableCell>{movement.toRackCode}</TableCell>
              <TableCell>{movement.toSlotLabel}</TableCell>
              <TableCell>{movement.quantity}</TableCell>
              <TableCell>{movement.movedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockMovementTable;
