import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const BarcodeDialog = ({ open, onClose, rackItem }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Barcode Information</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <h2>Item Name: {rackItem.Item?.name}</h2>
          <h2>Item ID: {rackItem.itemId}</h2>
          <h2>Rack Slot ID: {rackItem.rackSlotId}</h2>
          <h2>Quantity Stored: {rackItem.quantityStored}</h2>
          <h2>Date Stored: {new Date(rackItem.dateStored).toLocaleDateString()}</h2>
          <h2>Label Generated: {rackItem.labelGenerated ? 'Yes' : 'No'}</h2>
          <h2>Material Code: {rackItem.materialCode}</h2>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const DetailsPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedRackItem, setSelectedRackItem] = useState(null);

  const handleBarcodeClick = (rackItem) => {
    setSelectedRackItem(rackItem);
    setOpen(true);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1">
          Rack Items
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Item name</TableCell>
                <TableCell>Rack Slot ID</TableCell>
                <TableCell>Quantity Stored</TableCell>
                <TableCell>Date Stored</TableCell>
                <TableCell>Label Generated</TableCell>
                <TableCell>Material Code</TableCell>
                <TableCell>Rack Slot Label</TableCell>
                <TableCell>Barcode</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rackItems.map((rackItem) => (
                <TableRow key={rackItem.rackItemId}>
                  <TableCell>{rackItem.rackItemId}</TableCell>
                  <TableCell>{rackItem.Item?.name}</TableCell>
                  <TableCell>{rackItem.rackSlotId}</TableCell>
                  <TableCell>{rackItem.quantityStored}</TableCell>
                  <TableCell>{new Date(rackItem.dateStored).toLocaleDateString()}</TableCell>
                  <TableCell>{rackItem.labelGenerated ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{rackItem.materialCode}</TableCell>
                  <TableCell>{rackItem.RackSlot?.slotLabel}</TableCell>
                  <TableCell>
                    <img
                      src={rackItem.Item?.barcodeImage}
                      alt="Barcode"
                      style={{ width: 50, height: 50 }}
                      onClick={() => handleBarcodeClick(rackItem)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <BarcodeDialog open={open} onClose={() => setOpen(false)} rackItem={selectedRackItem} />
    </Grid>
  );
};