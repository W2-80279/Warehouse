
import {
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  useTheme,
  
} from '@mui/material';

const ItemDetailView = ({ item, categories, suppliers, onClose }) => {
  const theme = useTheme();

  const categoryName = categories.find(cat => cat.categoryId === item.categoryId)?.categoryName || 'N/A';
  const supplierName = suppliers.find(sup => sup.supplierId === item.supplierId)?.supplierName || 'N/A';

  const imageUrl = item.imageUrl ? `http://localhost:5000/${item.imageUrl}` : '/placeholder-image.png';
  const barcodeImage = item.barcodeImage ? item.barcodeImage.startsWith('data:image/') ? item.barcodeImage : `http://localhost:5000/${item.barcodeImage}` : '/placeholder-barcode.png';

  return (
    <>
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
        {item.name}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>SKU: {item.sku}</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Description: {item.description}</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Unit of Measure: {item.unitOfMeasure}</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Category: {categoryName}</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Supplier: {supplierName}</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Stock Level: {item.stockLevel}</Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>Min Stock Level: {item.minStockLevel}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <img
              src={imageUrl}
              alt={item.name}
              style={{ width: '100%', height: 'auto', marginBottom: theme.spacing(2), borderRadius: theme.shape.borderRadius }}
            />
            <img
              src={barcodeImage}
              alt="Barcode"
              style={{ width: '100%', height: 'auto', borderRadius: theme.shape.borderRadius }}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
};

export default ItemDetailView;
