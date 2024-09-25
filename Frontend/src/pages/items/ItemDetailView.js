import React, { useState } from 'react';
import {
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Button,
  Dialog,
} from '@mui/material';
import RackItemForm from '../management/RackItemForm'; // Import your RackItemForm component

const ItemDetailView = ({ item, categories, suppliers, onClose }) => {
  const [open, setOpen] = useState(false); // State to control dialog visibility

  const categoryName = categories.find(cat => cat.categoryId === item.categoryId)?.categoryName || 'N/A';
  const supplierName = suppliers.find(sup => sup.supplierId === item.supplierId)?.supplierName || 'N/A';

  // Ensure image URLs are properly constructed
  const imageUrl = item.imageUrl ? `http://localhost:5000/${item.imageUrl}` : '/placeholder-image.png';

  // Check if barcodeImage is a base64 string or a URL
  const barcodeImage = item.barcodeImage ? item.barcodeImage.startsWith('data:image/') ? item.barcodeImage : `http://localhost:5000/${item.barcodeImage}` : '/placeholder-barcode.png';

  const handleAllotRackClick = () => {
    setOpen(true); // Open the dialog for rack allotment
  };

  const handleCloseDialog = () => {
    setOpen(false); // Close the dialog
  };

  return (
    <>
      <DialogTitle>{item.name}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">SKU: {item.sku}</Typography>
            <Typography variant="body1">Description: {item.description}</Typography>
            <Typography variant="body1">Unit of Measure: {item.unitOfMeasure}</Typography>
            <Typography variant="body1">Category: {categoryName}</Typography>
            <Typography variant="body1">Supplier: {supplierName}</Typography>
            <Typography variant="body1">Stock Level: {item.stockLevel}</Typography>
            <Typography variant="body1">Min Stock Level: {item.minStockLevel}</Typography>
          </Grid>
          <Grid item xs={6}>
            <img src={imageUrl} alt={item.name} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
            <img src={barcodeImage} alt="Barcode" style={{ width: '100%', height: 'auto' }} />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAllotRackClick} // Handle button click to allot rack
          style={{ marginTop: '20px' }} // Add margin for better spacing
        >
          Allot Rack
        </Button>
      </DialogContent>

      {/* RackItemForm dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <RackItemForm
          item={item} // Pass the item to the RackItemForm
          onClose={handleCloseDialog}
          // Additional props for the form can go here
        />
      </Dialog>
    </>
  );
};

export default ItemDetailView;
