import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  useTheme,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const ItemDialog = ({ open, onClose, onSave, newItem, setNewItem, suppliers, categories }) => {
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const theme = useTheme();

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: file }); // Store the file for upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!newItem.image) {
      setSnackMessage('Please select an image.');
      setSnackOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('image', newItem.image);
    formData.append('sku', newItem.sku);
    formData.append('name', newItem.name);
    formData.append('description', newItem.description);
    formData.append('unitOfMeasure', newItem.unitOfMeasure);
    formData.append('categoryId', newItem.categoryId);
    formData.append('stockLevel', newItem.stockLevel);
    formData.append('minStockLevel', newItem.minStockLevel);
    formData.append('supplierId', newItem.supplierId);

    await onSave(formData);
    onClose();
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, textAlign: 'center' }}>
        {newItem.itemId ? 'Edit Item' : 'Add Item'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button
                variant="contained"
                color="primary"
                component="span"
                fullWidth
                startIcon={<PhotoCamera />}
                sx={{ mb: 2 }}
              >
                Upload Item Image
              </Button>
            </label>
            {newItem.image && (
              <img
                src={URL.createObjectURL(newItem.image)}
                alt="Preview"
                style={{ marginTop: '16px', maxWidth: '100%', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="SKU"
              name="sku"
              value={newItem.sku}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              placeholder="Enter SKU"
              sx={{ bgcolor: theme.palette.background.default }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              value={newItem.name}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              placeholder="Enter item name"
              sx={{ bgcolor: theme.palette.background.default }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={newItem.description}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              placeholder="Enter item description"
              multiline
              rows={2}
              sx={{ bgcolor: theme.palette.background.default }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Unit Of Measure"
              name="unitOfMeasure"
              value={newItem.unitOfMeasure}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              placeholder="e.g., pieces, kg"
              sx={{ bgcolor: theme.palette.background.default }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                name="categoryId"
                value={newItem.categoryId}
                onChange={handleChange}
                sx={{ bgcolor: theme.palette.background.default }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Supplier</InputLabel>
              <Select
                label="Supplier"
                name="supplierId"
                value={newItem.supplierId}
                onChange={handleChange}
                sx={{ bgcolor: theme.palette.background.default }}
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.supplierId} value={supplier.supplierId}>
                    {supplier.supplierName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Stock Level"
              name="stockLevel"
              value={newItem.stockLevel}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              type="number"
              placeholder="Enter stock level"
              sx={{ bgcolor: theme.palette.background.default }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Min Stock Level"
              name="minStockLevel"
              value={newItem.minStockLevel}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              type="number"
              placeholder="Enter minimum stock level"
              sx={{ bgcolor: theme.palette.background.default }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="dark">Cancel</Button>
        <Button onClick={handleSave} color="dark">Save</Button>
      </DialogActions>
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
        <MuiAlert onClose={handleSnackClose} severity="warning" sx={{ width: '100%' }}>
          {snackMessage}
        </MuiAlert>
      </Snackbar>
    </Dialog>
  );
};

export default ItemDialog;
