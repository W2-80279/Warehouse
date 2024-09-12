// src/pages/management/RackItemTable.js
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import { useRackItemContext } from './RackItemContext'; // Adjust the path as needed
import EditRackItemModal from './EditRackItemModal'; // Adjust the path as needed

const RackItemTable = () => {
  const { rackItems, setRackItems } = useRackItemContext();
  const [racks, setRacks] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rackItemsResponse, racksResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/rack-items', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/racks', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setRackItems(rackItemsResponse.data);
        setRacks(racksResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, [token, setRackItems]);

  const rackCodeMap = racks.reduce((acc, rack) => {
    acc[rack.rackId] = rack.rackCode;
    return acc;
  }, {});

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/rack-items/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setRackItems(prevItems => prevItems.filter(item => item.rackItemId !== id));
    } catch (error) {
      console.error('Error deleting item', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSaveEdit = (updatedItem) => {
    setRackItems(prevItems =>
      prevItems.map(item => (item.rackItemId === updatedItem.rackItemId ? updatedItem : item))
    );
    setModalOpen(false);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Rack Code</TableCell>
              <TableCell>Rack Slot</TableCell>
              <TableCell>Quantity Stored</TableCell>
              <TableCell>Date Stored</TableCell>
              <TableCell>Label Generated</TableCell>
              <TableCell>Material Code</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rackItems.map((rackItem) => (
              <TableRow key={rackItem.rackItemId}>
                <TableCell>{rackItem.rackItemId}</TableCell>
                <TableCell>{rackItem.Item?.name || 'N/A'}</TableCell>
                <TableCell>{rackCodeMap[rackItem.RackSlot?.rackId] || 'N/A'}</TableCell>
                <TableCell>{rackItem.RackSlot?.slotLabel || 'N/A'}</TableCell>
                <TableCell>{rackItem.quantityStored}</TableCell>
                <TableCell>{new Date(rackItem.dateStored).toLocaleDateString()}</TableCell>
                <TableCell>{rackItem.labelGenerated ? 'Yes' : 'No'}</TableCell>
                <TableCell>{rackItem.materialCode}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(rackItem)} variant="contained" color="primary">Edit</Button>
                  <Button onClick={() => handleDelete(rackItem.rackItemId)} variant="contained" color="secondary">Delete</Button>
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
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

export default RackItemTable;
