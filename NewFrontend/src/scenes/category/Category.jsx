import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Paper,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    description: '',
  });

  const theme = useTheme();
  const token = localStorage.getItem('token');

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenDialog = (category) => {
    setEditCategory(category);
    setNewCategory({
      categoryName: category?.categoryName || '',
      description: category?.description || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditCategory(null);
  };

  const handleChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editCategory) {
        await axios.put(`http://localhost:5000/api/categories/${editCategory.categoryId}`, newCategory, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/categories', newCategory, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      await fetchCategories();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving category', error);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category', error);
    }
  };

  // Check if screen size is small for responsive design
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: theme.palette.mode === 'dark' ? '#fff' : '#000',
          fontWeight: 'bold' // Set font weight to bold
        }}
      >
        Manage Categories
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog(null)}
        sx={{ mb: 2, color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
      >
        Add Category
      </Button>
      <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000', fontWeight:'bold'}}>
                Category Name
              </TableCell>
              <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000',fontWeight:'bold'}}>
                Description
              </TableCell>
              <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000',fontWeight:'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.categoryId}>
                <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000'  }}>
                  {category.categoryName}
                </TableCell>
                <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                  {category.description}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(category)}>
                    <EditIcon sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category.categoryId)}>
                    <DeleteIcon sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
          {editCategory ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            name="categoryName"
            value={newCategory.categoryName}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
          />
          <TextField
            label="Description"
            name="description"
            value={newCategory.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Category;
