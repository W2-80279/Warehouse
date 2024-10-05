// RackItemTable.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
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
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchRackItems, deleteRackItem } from '../../features/rackItemSlice';
import { moveStock } from '../../features/movementSlice';
import EditRackItemModal from './EditRackItemModal';
import StockMovementForm from '../movement/StockMovementForm';
import FlexBetween from '../../components/FlexBetween';

const RackItemTable = () => {
  const dispatch = useDispatch();
  const { rackItems } = useSelector((state) => state.rackItems);
  const { success } = useSelector((state) => state.movement);
  const [racks, setRacks] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const token = localStorage.getItem('token');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchRacks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/racks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRacks(response.data);
    } catch (error) {
      console.error('Error fetching racks', error);
    }
  };

  useEffect(() => {
    dispatch(fetchRackItems());
    fetchRacks();
  }, [dispatch]);

  const rackCodeMap = racks.reduce((acc, rack) => {
    acc[rack.rackId] = rack.rackCode;
    return acc;
  }, {});

  const handleDelete = (id) => {
    dispatch(deleteRackItem(id));
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleStockMovement = (item) => {
    setSelectedItem(item);
  };

  const handleMenuOpen = (event, item) => {
    setMenuAnchor(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleStockMovementSave = async (movementData) => {
    dispatch(moveStock(movementData));
  };

  useEffect(() => {
    if (success) {
      dispatch(fetchRackItems());
      setSelectedItem(null);
    }
  }, [success, dispatch]);

  return (
    <Box sx={{ p: 3, display:FlexBetween }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
        Rack Items
      </Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.default }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: theme.palette.text.primary }}>ID</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Item Name</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Rack Code</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Rack Slot</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Quantity Stored</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Date Stored</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Material Code</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rackItems.map((rackItem, index) => (
              <TableRow key={rackItem.rackItemId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{rackItem.Item?.name || 'N/A'}</TableCell>
                <TableCell>{rackCodeMap[rackItem.RackSlot?.rackId] || 'N/A'}</TableCell>
                <TableCell>{rackItem.RackSlot?.slotLabel || 'N/A'}</TableCell>
                <TableCell>{rackItem.quantityStored}</TableCell>
                <TableCell>{new Date(rackItem.dateStored).toLocaleDateString()}</TableCell>
                <TableCell>{rackItem.materialCode}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(rackItem)}>
                    <EditIcon sx={{ color: theme.palette.text.primary }} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(rackItem.rackItemId)}>
                    <DeleteIcon sx={{ color: theme.palette.text.primary }} />
                  </IconButton>
                  <IconButton onClick={(e) => handleMenuOpen(e, rackItem)}>
                    <MoreVertIcon sx={{ color: theme.palette.text.primary }} />
                  </IconButton>
                  <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => handleStockMovement(rackItem)}>Move Stock</MenuItem>
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
          rackItem={editingItem}
          onSave={() => {
            dispatch(fetchRackItems());
            setModalOpen(false);
          }}
        />
      )}

      {selectedItem && (
        <StockMovementForm
          key={selectedItem.rackItemId}
          open={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          selectedItem={selectedItem}
          fromRackId={selectedItem.RackSlot?.rackId}
          fromSlotLabel={selectedItem.RackSlot?.slotLabel}
          fromSlotId={selectedItem.RackSlot?.id}
          onStockMovementSave={handleStockMovementSave}
        />
      )}
    </Box>
  );
};

export default RackItemTable;
