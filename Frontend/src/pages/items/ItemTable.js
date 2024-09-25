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
import VisibilityIcon from '@mui/icons-material/Visibility'; // Eye icon for details view
import ItemDetailView from './ItemDetailView'; // Detailed view component

const ItemTable = ({ items, categories, suppliers, onEdit, onDelete }) => {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedItem(null);
  };

  return (
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
                <IconButton onClick={() => onEdit(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(item.itemId)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => handleViewDetails(item)}>
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for detailed view */}
      <Dialog open={openDetail} onClose={handleCloseDetail} fullWidth maxWidth="md">
        {selectedItem && (
          <ItemDetailView
            item={selectedItem}
            categories={categories}
            suppliers={suppliers}
            onClose={handleCloseDetail}
          />
        )}
      </Dialog>
    </TableContainer>
  );
};

export default ItemTable;
