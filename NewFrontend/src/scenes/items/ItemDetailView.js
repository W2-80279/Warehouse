import {
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';

const ItemDetailView = ({ item, onClose }) => {
  const theme = useTheme();

  // Debugging logs
  useEffect(() => {
    console.log('Item:', item);
  }, [item]);

  if (!item) {
    return <Typography variant="h6">No item details available.</Typography>;
  }

  // Accessing category and supplier directly from item object
  const categoryName = item.Category?.categoryName || 'N/A';
  const supplierName = item.Supplier?.supplierName || 'N/A';

  const imageUrl = item.imageUrl ? `http://localhost:5000/${item.imageUrl}` : '/placeholder-image.png';
  const barcodeImage = item.barcodeImage
    ? item.barcodeImage.startsWith('data:image/')
      ? item.barcodeImage
      : `http://localhost:5000/${item.barcodeImage}`
    : '/placeholder-barcode.png';

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden', transition: '0.3s', transform: 'scale(1.05)' }}>
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">{item.name}</Typography>
        <IconButton onClick={onClose} sx={{ color: theme.palette.primary.contrastText }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CardContent>
              <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                SKU: {item.sku || 'N/A'}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Description: {item.description || 'No description available'}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Unit of Measure: {item.unitOfMeasure || 'N/A'}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Category: {categoryName}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Supplier: {supplierName}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Stock Level: {item.stockLevel !== undefined ? item.stockLevel : 'N/A'}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Min Stock Level: {item.minStockLevel !== undefined ? item.minStockLevel : 'N/A'}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CardMedia
              component="img"
              image={imageUrl}
              alt={item.name || 'Item Image'}
              sx={{
                width: '100%',
                height: 'auto',
                marginBottom: theme.spacing(2),
                borderRadius: theme.shape.borderRadius,
              }}
            />
            <CardMedia
              component="img"
              image={barcodeImage}
              alt="Barcode"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: theme.shape.borderRadius,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Card>
  );
};

export default ItemDetailView;
