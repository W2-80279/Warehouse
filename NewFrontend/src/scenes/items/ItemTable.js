import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Dialog,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ItemDetailView from './ItemDetailView';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectSearchQuery } from '../../features/searchSlice'; // Import the selector

const ItemTable = ({ items = [], categories = [], suppliers = [], onEdit, onDelete }) => {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const theme = useTheme();
  const searchQuery = useSelector(selectSearchQuery); // Get search query from Redux

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedItem(null);
  };

  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto', backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', p: { xs: 1, sm: 2 } }}>SKU</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', p: { xs: 1, sm: 2 } }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', p: { xs: 1, sm: 2 } }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', p: { xs: 1, sm: 2 } }}>Unit Of Measure</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', p: { xs: 1, sm: 2 } }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', p: { xs: 1, sm: 2 } }}>Supplier</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', p: { xs: 1, sm: 2 } }}>Stock Level</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', p: { xs: 1, sm: 2 } }}>Min Stock Level</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', p: { xs: 1, sm: 2 } }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>{item.sku}</TableCell>
                <TableCell sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>{item.name}</TableCell>
                <TableCell sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>{item.description}</TableCell>
                <TableCell sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>{item.unitOfMeasure}</TableCell>
                <TableCell sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>
                  {categories.find(cat => cat.categoryId === item.categoryId)?.categoryName || 'N/A'}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>
                  {suppliers.find(sup => sup.supplierId === item.supplierId)?.supplierName || 'N/A'}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>{item.stockLevel}</TableCell>
                <TableCell sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>{item.minStockLevel}</TableCell>
                <TableCell sx={{ textAlign: 'center', p: { xs: 1, sm: 2 } }}>
                  <IconButton onClick={() => handleViewDetails(item)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => onEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(item.itemId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                No items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Dialog open={openDetail} onClose={handleCloseDetail}>
        <ItemDetailView item={selectedItem} onClose={handleCloseDetail} />
      </Dialog>
    </TableContainer>
  );
};

export default ItemTable;
