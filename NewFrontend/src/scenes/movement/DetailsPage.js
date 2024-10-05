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
  Typography,
  Grid,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import BarcodeReader from 'react-barcode-reader';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExportIcon from '@mui/icons-material/GetApp';
import * as XLSX from 'xlsx'; // Library for Excel export
import FlexBetween from '../../components/FlexBetween';
import { useTheme } from '@mui/material/styles';

const DetailsPage = () => {
  const theme = useTheme(); // Get theme
  const token = localStorage.getItem('token');
  const [rackItems, setRackItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState(null);
  const [items, setItems] = useState({});
  const [suppliers, setSuppliers] = useState({});
  const [categories, setCategories] = useState({});
  const [racks, setRacks] = useState([]);
  const [filter, setFilter] = useState('active'); // Filter state for active, all, deleted
  const [anchorEl, setAnchorEl] = useState(null);

  // Fetch rack items based on the selected filter
  useEffect(() => {
    const fetchRackItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/rack-items`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRackItems(response.data);
      } catch (error) {
        console.error('Error fetching rack items', error);
      }
    };
    fetchRackItems();
  }, [token]);

  // Fetch racks data
  useEffect(() => {
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
    fetchRacks();
  }, [token]);

  // Fetch item details based on rack items
  useEffect(() => {
    rackItems.forEach((rackItem) => {
      if (!items[rackItem.itemId]) {
        axios
          .get(`http://localhost:5000/api/items/${rackItem.itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setItems((prevItems) => ({ ...prevItems, [rackItem.itemId]: response.data }));
            if (!suppliers[response.data.supplierId]) {
              axios
                .get(`http://localhost:5000/api/suppliers/${response.data.supplierId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                  setSuppliers((prevSuppliers) => ({
                    ...prevSuppliers,
                    [response.data.supplierId]: response.data,
                  }));
                })
                .catch((error) => {
                  console.error(`Error fetching supplier details for ${response.data.supplierId}:`, error);
                });
            }
            if (!categories[response.data.categoryId]) {
              axios
                .get(`http://localhost:5000/api/categories/${response.data.categoryId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                  setCategories((prevCategories) => ({
                    ...prevCategories,
                    [response.data.categoryId]: response.data,
                  }));
                })
                .catch((error) => {
                  console.error(`Error fetching category details for ${response.data.categoryId}:`, error);
                });
            }
          })
          .catch((error) => {
            console.error(`Error fetching item details for ${rackItem.itemId}:`, error);
          });
      }
    });
  }, [rackItems, items, suppliers, categories, token]);

  // Handle barcode scan
  const handleScan = async (barcode) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/items/barcode/${barcode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScannedItem(response.data);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching item by barcode:', error);
    }
  };

  const handleError = (err) => {
    console.error('Error scanning barcode:', err);
  };

  const handleClose = () => {
    setOpen(false);
    setScannedItem(null);
  };

  const rackCodeMap = racks.reduce((acc, rack) => {
    acc[rack.rackId] = rack.rackCode;
    return acc;
  }, {});

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterSelect = (selectedFilter) => {
    setFilter(selectedFilter);
    setAnchorEl(null);
  };

  const handleExport = () => {
    // Convert rackItems to a format suitable for exporting
    const exportData = rackItems.map((rackItem) => ({
      ID: rackItem.rackItemId,
      'Item Name': items[rackItem.itemId]?.name || 'N/A',
      'Rack Name': rackCodeMap[rackItem.RackSlot?.rackId] || 'N/A',
      'Rack Slot Label': rackItem.RackSlot?.slotLabel || 'N/A',
      'Quantity Stored': rackItem.quantityStored,
      'Date Stored': rackItem.dateStored,
      'Material Code': rackItem.materialCode,
      'Barcode': items[rackItem.itemId]?.barcode || 'N/A',
      'Supplier Name': suppliers[items[rackItem.itemId]?.supplierId]?.supplierName || 'N/A',
      'Category Name': categories[items[rackItem.itemId]?.categoryId]?.categoryName || 'N/A',
      'Soft Deleted': rackItem.isDeleted ? 'Yes' : 'No',
    }));

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rack Items');

    // Export the workbook to Excel
    XLSX.writeFile(workbook, 'RackItems.xlsx');
  };

  const filteredRackItems = rackItems.filter((rackItem) => {
    if (filter === 'active') return !rackItem.isDeleted;
    if (filter === 'deleted') return rackItem.isDeleted;
    return true; // For 'all'
  });

  return (
    <Box sx={{ flex: 1, p: 3, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1">
            Rack Items
          </Typography>
        </Grid>

        {/* Barcode Reader for mobile scanning */}
        <BarcodeReader onError={handleError} onScan={handleScan} />

        <Grid item xs={12} container justifyContent="space-between" alignItems="center">
          <div>
            <Tooltip title="Filter">
              <IconButton onClick={handleFilterClick}>
                <FilterListIcon sx={{ color: theme.palette.text.primary }} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => handleFilterSelect('all')}>All Items</MenuItem>
              <MenuItem onClick={() => handleFilterSelect('active')}>Active Items</MenuItem>
              <MenuItem onClick={() => handleFilterSelect('deleted')}>Deleted Items</MenuItem>
            </Menu>
          </div>

          <Tooltip title="Export">
            <IconButton onClick={handleExport}>
              <ExportIcon sx={{ color: theme.palette.text.primary }} />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Serial No</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Item Name</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Rack Name</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Rack Slot Label</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Quantity Stored</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Date Stored</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Material Code</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Barcode</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Supplier Name</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Category Name</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Soft Deleted</TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>Barcode Image</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRackItems.map((rackItem, index) => (
                  <TableRow
                    key={rackItem.rackItemId}
                    style={rackItem.isDeleted ? { backgroundColor: theme.palette.error.light } : {}}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{items[rackItem.itemId]?.name || 'N/A'}</TableCell>
                    <TableCell>{rackCodeMap[rackItem.RackSlot?.rackId] || 'N/A'}</TableCell>
                    <TableCell>{rackItem.RackSlot?.slotLabel || 'N/A'}</TableCell>
                    <TableCell>{rackItem.quantityStored}</TableCell>
                    <TableCell>{rackItem.dateStored}</TableCell>
                    <TableCell>{rackItem.materialCode}</TableCell>
                    <TableCell>{items[rackItem.itemId]?.barcode || 'N/A'}</TableCell>
                    <TableCell>{suppliers[items[rackItem.itemId]?.supplierId]?.supplierName || 'N/A'}</TableCell>
                    <TableCell>{categories[items[rackItem.itemId]?.categoryId]?.categoryName || 'N/A'}</TableCell>
                    <TableCell>{rackItem.isDeleted ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ width: 100, height: 50, cursor: 'pointer' }}
                        onClick={() => handleScan(rackItem.Item?.barcode)}
                      >
                        <img src={rackItem.Item?.barcodeImage} alt="Barcode" style={{ width: '100%' }} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Scanned Item Details</DialogTitle>
          <DialogContent>
            {scannedItem && (
              <div>
                <Typography variant="h6">{scannedItem.name}</Typography>
                <Typography>Barcode: {scannedItem.barcode}</Typography>
                {/* Add any other item details you want to display */}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Grid>
    </Box>
  );
};

export default DetailsPage;
