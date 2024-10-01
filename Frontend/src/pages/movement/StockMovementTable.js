import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { useRackItemContext } from './RackItemContext';
import EditRackItemModal from '../management/EditRackItemModal';
import StockMovementForm from '../movement/StockMovementForm';

const StockMovementTable = () => {
  const { rackItems, setRackItems } = useRackItemContext();
  const [stockMovements, setStockMovements] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const token = localStorage.getItem('token');
  const [items, setItems] = useState({}); // Store item details
  const [racks, setRacks] = useState([]); // Store rack details
  const [rackSlots, setRackSlots] = useState({}); // Store rack slot details

  // Fetch stock movements
  const fetchStockMovements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stock-movements', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStockMovements(response.data);
    } catch (error) {
      console.error('Error fetching stock movements', error);
    }
  };

  // Fetch item details
  const fetchItemDetails = async (itemId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prevItems) => ({ ...prevItems, [itemId]: response.data }));
    } catch (error) {
      console.error(`Error fetching item details for ${itemId}:`, error);
    }
  };

  // Fetch rack details
  const fetchRackDetails = async (rackId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/racks/${rackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRacks((prevRacks) => [...prevRacks, response.data]);
    } catch (error) {
      console.error(`Error fetching rack details for ${rackId}:`, error);
    }
  };

  // Fetch rack slot details
  const fetchRackSlotDetails = async (rackSlotId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rack-slots/${rackSlotId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRackSlots((prevRackSlots) => ({ ...prevRackSlots, [rackSlotId]: response.data }));
    } catch (error) {
      console.error(`Error fetching rack slot details for ${rackSlotId}:`, error);
    }
  };

  useEffect(() => {
    fetchStockMovements();
  }, [token]);

  useEffect(() => {
    stockMovements.forEach((movement) => {
      if (!items[movement.RackItem.itemId]) {
        fetchItemDetails(movement.RackItem.itemId);
      }
      if (!racks.find((rack) => rack.rackId === movement.fromRackId)) {
        fetchRackDetails(movement.fromRackId);
      }
      if (!racks.find((rack) => rack.rackId === movement.toRackId)) {
        fetchRackDetails(movement.toRackId);
      }
      if (!rackSlots[movement.fromSlotId]) {
        fetchRackSlotDetails(movement.fromSlotId);
      }
      if (!rackSlots[movement.toSlotId]) {
        fetchRackSlotDetails(movement.toSlotId);
      }
    });
  }, [stockMovements, items, racks, rackSlots]);

  const rackCodeMap = racks.reduce((acc, rack) => {
    acc[rack.rackId] = rack.rackCode;
    return acc;
  }, {});

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleStockMovementSave = async () => {
    await fetchStockMovements();
    setSelectedItem(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Movement ID</TableCell>
              {/* <TableCell>Item ID</TableCell> */}
              <TableCell> Item Name</TableCell>
              <TableCell>From Rack Code</TableCell>
              <TableCell>From Slot Label</TableCell>
              <TableCell>To Rack Code</TableCell>
              <TableCell>To Slot Label</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Movement Date</TableCell>
              <TableCell>Moved By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockMovements.map((movement) => (
              <TableRow key={movement.movementId}>
                <TableCell>{movement.movementId}</TableCell>
                {/* <TableCell>{movement.RackItem.itemId}</TableCell> */}
                <TableCell>
                  {items[movement.RackItem.itemId] ? items[movement.RackItem.itemId].name : 'Loading...'}
                </TableCell>
                <TableCell>
                  {rackCodeMap[movement.fromRackId] || 'N/A'}
                </TableCell>
                <TableCell>
                  {rackSlots[movement.fromSlotId] ? rackSlots[movement.fromSlotId].slotLabel : 'N/A'}
                </TableCell>
                <TableCell>
                  {rackCodeMap[movement.toRackId] || 'N/A'}
                </TableCell>
                <TableCell>
                  {rackSlots[movement.toSlotId] ? rackSlots[movement.toSlotId].slotLabel : 'N/A'}
                </TableCell>
                <TableCell>{movement.quantity}</TableCell>
                <TableCell>{movement.movementDate}</TableCell>
                <TableCell>{movement.movedBy}</TableCell>
                <TableCell>
                  <Button
                    onClick={(event) => {
                      setMenuAnchor(event.currentTarget);
                      setSelectedItem(movement);
                    }}
                  >
                    <MoreVertIcon />
                  </Button>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem
                      onClick={() => {
                        setEditingItem(movement);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {editingItem && (
        <EditRackItemModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          item={editingItem}
          onSave={handleStockMovementSave}
        />
      )}
    </>
  );
};

export default StockMovementTable;