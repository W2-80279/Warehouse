import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const ItemForm = ({ item, onChange, categories, suppliers }) => {
  const handleFieldChange = (e) => {
    onChange({ ...item, [e.target.name]: e.target.value });
  };

  return (
    <>
      <TextField label="SKU" name="sku" value={item.sku} onChange={handleFieldChange} fullWidth margin="dense" />
      <TextField label="Name" name="name" value={item.name} onChange={handleFieldChange} fullWidth margin="dense" />
      <TextField label="Description" name="description" value={item.description} onChange={handleFieldChange} fullWidth margin="dense" />
      <TextField label="Unit Of Measure" name="unitOfMeasure" value={item.unitOfMeasure} onChange={handleFieldChange} fullWidth margin="dense" />
      <FormControl fullWidth margin="dense">
        <InputLabel>Category</InputLabel>
        <Select name="categoryId" value={item.categoryId} onChange={handleFieldChange}>
          {categories.map(category => (
            <MenuItem key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="dense">
        <InputLabel>Supplier</InputLabel>
        <Select name="supplierId" value={item.supplierId} onChange={handleFieldChange}>
          {suppliers.map(supplier => (
            <MenuItem key={supplier.supplierId} value={supplier.supplierId}>
              {supplier.supplierName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField label="Stock Level" name="stockLevel" value={item.stockLevel} onChange={handleFieldChange} fullWidth margin="dense" />
      <TextField label="Min Stock Level" name="minStockLevel" value={item.minStockLevel} onChange={handleFieldChange} fullWidth margin="dense" />
    </>
  );
};

export default ItemForm;
