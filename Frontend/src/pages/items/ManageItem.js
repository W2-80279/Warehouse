import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import axios from 'axios';
import ItemTable from './ItemTable';
import ItemDialog from './ItemDialog';
import AddIcon from '@mui/icons-material/Add';

const ManageItem = () => {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newItem, setNewItem] = useState({});

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [itemsResponse, suppliersResponse, categoriesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/items', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/suppliers', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/categories', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setItems(itemsResponse.data.items);
      setSuppliers(suppliersResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (item) => {
    setNewItem(item || { sku: '', name: '', description: '', unitOfMeasure: '', categoryId: '', supplierId: '', stockLevel: '', minStockLevel: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async (formData) => {
    try {
      if (newItem.itemId) {
        await axios.put(`http://localhost:5000/api/items/${newItem.itemId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('http://localhost:5000/api/items', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      await fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving item', error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${itemId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Manage Items</Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog(null)}
        sx={{ mb: 2 }}
      >
        Add Item
      </Button>
      <ItemTable items={items} categories={categories} suppliers={suppliers} onEdit={handleOpenDialog} onDelete={handleDelete} />
      <ItemDialog open={openDialog} onClose={handleCloseDialog} onSave={handleSave} newItem={newItem} setNewItem={setNewItem} suppliers={suppliers} categories={categories} />
    </Box>
  );
};

export default ManageItem;
