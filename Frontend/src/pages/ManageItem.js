import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Paper,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const ManageItem = () => {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({
    sku: '',
    name: '',
    description: '',
    unitOfMeasure: '',
    categoryId: '',
    supplierId: '',
    stockLevel: '',
    minStockLevel: '',
  });

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [itemsResponse, suppliersResponse, categoriesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/items', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/suppliers', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setItems(itemsResponse.data);
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
    setEditItem(item);
    setNewItem({
      sku: item?.sku || '',
      name: item?.name || '',
      description: item?.description || '',
      unitOfMeasure: item?.unitOfMeasure || '',
      categoryId: item?.categoryId || '',
      supplierId: item?.supplierId || '',
      stockLevel: item?.stockLevel || '',
      minStockLevel: item?.minStockLevel || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditItem(null);
  };

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editItem) {
        await axios.put(`http://localhost:5000/api/items/${editItem.itemId}`, newItem, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/items', newItem, {
          headers: { Authorization: `Bearer ${token}` }
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
      const response = await axios.delete(`http://localhost:5000/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Delete response:', response);
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error.response || error.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Items
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog(null)}
        sx={{ mb: 2 }}
      >
        Add Item
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Unit Of Measure</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Stock Level</TableCell>
              <TableCell>Min Stock Level</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.unitOfMeasure}</TableCell>
                <TableCell>{categories.find(cat => cat.categoryId === item.categoryId)?.categoryName || 'N/A'}</TableCell>
                <TableCell>{suppliers.find(sup => sup.supplierId === item.supplierId)?.supplierName || 'N/A'}</TableCell>
                <TableCell>{item.stockLevel}</TableCell>
                <TableCell>{item.minStockLevel}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(item)}>
                    <EditIcon /> &nbsp;
                  </IconButton> &nbsp;
                  <IconButton onClick={() => handleDelete(item.itemId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <TextField
            label="SKU"
            name="sku"
            value={newItem.sku}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Name"
            name="name"
            value={newItem.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            name="description"
            value={newItem.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Unit Of Measure"
            name="unitOfMeasure"
            value={newItem.unitOfMeasure}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              name="categoryId"
              value={newItem.categoryId}
              onChange={handleChange}
            >
              {categories.map(category => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Supplier</InputLabel>
            <Select
              label="Supplier"
              name="supplierId"
              value={newItem.supplierId}
              onChange={handleChange}
            >
              {suppliers.map(supplier => (
                <MenuItem key={supplier.supplierId} value={supplier.supplierId}>
                  {supplier.supplierName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Stock Level"
            name="stockLevel"
            value={newItem.stockLevel}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Min Stock Level"
            name="minStockLevel"
            value={newItem.minStockLevel}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Button onClick={fetchData} color="secondary">
        Refresh Items
      </Button>
    </Box>
  );
};

export default ManageItem;
