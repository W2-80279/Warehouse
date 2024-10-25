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
  TextField,
  DialogActions,
} from '@mui/material';
import BarcodeReader from 'react-barcode-reader';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExportIcon from '@mui/icons-material/GetApp';
import * as XLSX from 'xlsx';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Collapse } from '@mui/material';


const DetailsPage = () => {
  const theme = useTheme();
  const token = localStorage.getItem('token');
  const [rackItems, setRackItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState(null);
  const [items, setItems] = useState({});
  const [suppliers, setSuppliers] = useState({});
  const [categories, setCategories] = useState({});
  const [racks, setRacks] = useState([]);
  const [filter, setFilter] = useState('active');
  const [anchorEl, setAnchorEl] = useState(null);
  const [generalFilter, setGeneralFilter] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchBoxOpen, setSearchBoxOpen] = useState(false); // State for search box visibility

  // Fetch rack items, racks data, and other logic here...

  const handleSearchToggle = () => {
    setSearchBoxOpen((prev) => !prev);
  };

  // Fetch rack items
  useEffect(() => {
    const fetchRackItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rack-items', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setItems((prevItems) => ({
              ...prevItems,
              [rackItem.itemId]: response.data,
            }));
            if (!suppliers[response.data.supplierId]) {
              axios
                .get(`http://localhost:5000/api/suppliers/${response.data.supplierId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
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
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    const exportData = rackItems
      .filter((rackItem) => {
        const item = items[rackItem.itemId] || {};
        const dateStored = new Date(rackItem.dateStored);

        // Match active, deleted, or all based on filter
        const matchesFilter =
          (filter === 'active' && !rackItem.isDeleted) ||
          (filter === 'deleted' && rackItem.isDeleted) ||
          (filter === 'all');

        // Check date range
        const matchesDateRange =
          (!dateRange[0] || dateStored >= dateRange[0]) &&
          (!dateRange[1] || dateStored <= dateRange[1]);

        return matchesFilter && matchesDateRange;
      })
      .map((rackItem) => ({
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
      }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rack Items');

    XLSX.writeFile(workbook, 'RackItems.xlsx');
  };

  // Filter rack items based on search and date range
  const filteredRackItems = rackItems.filter((rackItem) => {
    const item = items[rackItem.itemId] || {};
    const supplier = suppliers[item.supplierId] || {};
    const category = categories[item.categoryId] || {};

    // Convert the search term to lowercase for case-insensitive comparison
    const searchTerm = generalFilter?.toLowerCase() || '';

    // Check if any of the relevant fields include the search term
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm) ||
      rackCodeMap[rackItem.RackSlot?.rackId]?.toLowerCase().includes(searchTerm) ||
      rackItem.materialCode?.toLowerCase().includes(searchTerm) ||
      supplier.supplierName?.toLowerCase().includes(searchTerm) ||
      category.categoryName?.toLowerCase().includes(searchTerm);

    // Check if the date stored is within the selected date range
    const dateStored = new Date(rackItem.dateStored);
    const matchesDateRange =
      (!dateRange[0] || dateStored >= dateRange[0]) &&
      (!dateRange[1] || dateStored <= dateRange[1]);

    // Match the filter (active/deleted/all)
    const matchesFilter =
      (filter === 'active' && !rackItem.isDeleted) ||
      (filter === 'deleted' && rackItem.isDeleted) ||
      (filter === 'all');

    return matchesSearch && matchesDateRange && matchesFilter;
  });

  return (
    <Box sx={{ flex: 1, padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} display="flex" alignItems="center">
          <Tooltip title="Filter">
            <IconButton onClick={handleFilterClick}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => handleFilterSelect('active')}>Active Information Item</MenuItem>
            <MenuItem onClick={() => handleFilterSelect('deleted')}>Removed Infromation Item</MenuItem>
            <MenuItem onClick={() => handleFilterSelect('all')}>All Infromation Item</MenuItem>
          </Menu>
         <TextField
            type="date"
            label="Start Date"
            variant="outlined"
            onChange={(e) => setDateRange([new Date(e.target.value), dateRange[1]])}
            sx={{ marginLeft: 2, marginRight: 2 }} // Add right margin to separate from the next field
            InputLabelProps={{ shrink: true }} // Ensure label does not overlap
           // fullWidth // Makes the input take the full width of its container
          />
          <TextField
              type="date"
              label="End Date"
              variant="outlined"
              onChange={(e) => setDateRange([dateRange[0], new Date(e.target.value)])}
              sx={{ marginLeft: 2 }} // Keep left margin consistent
              InputLabelProps={{ shrink: true }} // Ensure label does not overlap
              //fullWidth // Makes the input take the full width of its container
            />

          <Tooltip title="Export Data">
            <IconButton onClick={handleExport} sx={{ marginLeft: 2 }}>
              <ExportIcon sx={{ color: theme.palette.text.primary }} />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Rack Name</TableCell>
                  <TableCell>Rack Slot Label</TableCell>
                  <TableCell>Quantity Stored</TableCell>
                  <TableCell>Date Stored</TableCell>
                  <TableCell>Material Code</TableCell>
                  <TableCell>Barcode</TableCell>
                  <TableCell>Supplier Name</TableCell>
                  <TableCell>Category Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRackItems.map((rackItem) => (
                  <TableRow key={rackItem.rackItemId}>
                    <TableCell>{rackItem.rackItemId}</TableCell>
                    <TableCell>{items[rackItem.itemId]?.name || 'N/A'}</TableCell>
                    <TableCell>{rackCodeMap[rackItem.RackSlot?.rackId] || 'N/A'}</TableCell>
                    <TableCell>{rackItem.RackSlot?.slotLabel || 'N/A'}</TableCell>
                    <TableCell>{rackItem.quantityStored}</TableCell>
                    <TableCell>{new Date(rackItem.dateStored).toLocaleDateString()}</TableCell>
                    <TableCell>{rackItem.materialCode}</TableCell>
                    <TableCell>{items[rackItem.itemId]?.barcode || 'N/A'}</TableCell>
                    <TableCell>{suppliers[items[rackItem.itemId]?.supplierId]?.supplierName || 'N/A'}</TableCell>
                    <TableCell>{categories[items[rackItem.itemId]?.categoryId]?.categoryName || 'N/A'}</TableCell>
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
              <Box>
                <Typography variant="h6">Item Name: {scannedItem.name}</Typography>
                <Typography>Material Code: {scannedItem.materialCode}</Typography>
                <Typography>Supplier: {suppliers[scannedItem.supplierId]?.supplierName}</Typography>
                <Typography>Category: {categories[scannedItem.categoryId]?.categoryName}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>

        <BarcodeReader onScan={handleScan} onError={handleError} />
      </Grid>
    </Box>
  );
};

export default DetailsPage;
