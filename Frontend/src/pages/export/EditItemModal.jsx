import React from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  Button,
  TextField
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%', // Set width to 80% for responsiveness
  maxHeight: '80%', // Set max height
  overflowY: 'auto', // Allow vertical scrolling
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2, // Optional: for rounded corners
};

const EditItemModal = ({ open, onClose, item, onSave }) => {
  const [formData, setFormData] = React.useState(item);

  React.useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      aria-labelledby="edit-item-modal-title"
      aria-describedby="edit-item-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="edit-item-modal-title" variant="h6" component="h2">
            Edit Item
          </Typography>
          {Object.keys(formData).map((key) => (
            <TextField
              key={key}
              label={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          ))}
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button onClick={onClose} color="secondary" variant="outlined" sx={{ marginRight: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              Save
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditItemModal;
