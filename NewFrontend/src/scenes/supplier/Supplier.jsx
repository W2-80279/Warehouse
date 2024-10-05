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
  useTheme,
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
    contactPerson: '',  // Added contactPerson
    email: '',          // Added email
    phone: '',          // Added phone
    address: '',
  });

  const theme = useTheme();
  const token = localStorage.getItem('token');

  // Fetch suppliers from the API
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(response.data);
      console.log(response.data); 
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
      contactPerson: supplier?.contactPerson || '', // Added contactPerson
      email: supplier?.email || '',                // Added email
      phone: supplier?.phone || '',                // Added phone
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
        await axios.put(
          `http://localhost:5000/api/suppliers/${editSupplier.supplierId}`,
          newSupplier,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post('http://localhost:5000/api/suppliers', newSupplier, {
          headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
      >
        Manage Suppliers
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog(null)}
        sx={{ mb: 2 }}
      >sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}
        Add Supplier
      </Button>
      <TableContainer component={Paper} >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: theme.palette.text.primary }}>Supplier Name</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Contact Person</TableCell> {/* Added */}
              <TableCell sx={{ color: theme.palette.text.primary }}>Email</TableCell> {/* Added */}
              <TableCell sx={{ color: theme.palette.text.primary }}>Phone</TableCell> {/* Added */}
              <TableCell sx={{ color: theme.palette.text.primary }}>Address</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.supplierId}>
                <TableCell sx={{ color: theme.palette.text.primary }}>{supplier.supplierName}</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary }}>{supplier.contactPerson}</TableCell> {/* Added */}
                <TableCell sx={{ color: theme.palette.text.primary }}>{supplier.email}</TableCell> {/* Added */}
                <TableCell sx={{ color: theme.palette.text.primary }}>{supplier.phone}</TableCell> {/* Added */}
                <TableCell sx={{ color: theme.palette.text.primary }}>{supplier.address}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(supplier)}>
                    <EditIcon sx={{ color: theme.palette.secondary.dark }} /> {/* Darker EditIcon */}
                  </IconButton>
                  <IconButton onClick={() => handleDelete(supplier.supplierId)}>
                    <DeleteIcon sx={{ color: theme.palette.error.main }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ color: theme.palette.text.primary }}>
          {editSupplier ? 'Edit Supplier' : 'Add Supplier'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Supplier Name"
            name="supplierName"
            value={newSupplier.supplierName}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={{ mb: 2, color: theme.palette.text.primary }}
          />
          <TextField
            label="Contact Person"
            name="contactPerson" // Added
            value={newSupplier.contactPerson} // Added
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={{ mb: 2, color: theme.palette.text.primary }}
          />
          <TextField
            label="Email"
            name="email" // Added
            value={newSupplier.email} // Added
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={{ mb: 2, color: theme.palette.text.primary }}
          />
          <TextField
            label="Phone"
            name="phone" // Added
            value={newSupplier.phone} // Added
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={{ mb: 2, color: theme.palette.text.primary }}
          />
          <TextField
            label="Address"
            name="address"
            value={newSupplier.address}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={{ color: theme.palette.text.primary }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="dark">
            Cancel
          </Button>
          <Button onClick={handleSave} color="dark">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Supplier;
