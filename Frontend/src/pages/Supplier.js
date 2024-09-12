// pages/supplier.js
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
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    supplierName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
  });

  const token = localStorage.getItem('token');

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers', error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpenDialog = (supplier) => {
    setEditSupplier(supplier);
    setNewSupplier({
      supplierName: supplier?.supplierName || '',
      contactPerson: supplier?.contactPerson || '',
      phone: supplier?.phone || '',
      email: supplier?.email || '',
      address: supplier?.address || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditSupplier(null);
  };

  const handleChange = (e) => {
    setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editSupplier) {
        await axios.put(`http://localhost:5000/api/suppliers/${editSupplier.supplierId}`, newSupplier, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/suppliers', newSupplier, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      await fetchSuppliers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving supplier', error);
    }
  };

  const handleDelete = async (supplierId) => {
    try {
      await axios.delete(`http://localhost:5000/api/suppliers/${supplierId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Suppliers
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog(null)}
        sx={{ mb: 2 }}
      >
        Add Supplier
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.supplierId}>
                <TableCell>{supplier.supplierName}</TableCell>
                <TableCell>{supplier.contactPerson}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.address}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(supplier)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(supplier.supplierId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editSupplier ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Supplier Name"
            name="supplierName"
            value={newSupplier.supplierName}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Contact Person"
            name="contactPerson"
            value={newSupplier.contactPerson}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Phone"
            name="phone"
            value={newSupplier.phone}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            name="email"
            value={newSupplier.email}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Address"
            name="address"
            value={newSupplier.address}
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
    </Box>
  );
};

export default Supplier;
