// src/AdminSidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Dashboard, Store as Warehouse, Category, Assignment, ListAlt, LocalShipping, WarehouseSharp } from '@mui/icons-material'; // Fixed import
import { Link } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import { css } from '@emotion/react';
import logo from '../staticimages/KiaviSuntechSolutionsLogo-02.jpg'; // Import your logo

// Keyframe for the hover animation
const hoverAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(0);
  }
`;

// Styles for animated list items
const animatedListItem = css`
  &:hover {
    animation: ${hoverAnimation} 0.3s ease-in-out;
    background-color: #e3f2fd; // Light blue background on hover
  }
`;

const AdminSidebar = ({ open, onClose }) => {
  const drawerWidth = 240;
 

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5', // Light background for the sidebar
          color: '#6a1b9a', // Purple text color
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <div style={{ flex: 1 }}>
        <List>
          {/* Sidebar Header */}
          <Typography variant="h6" sx={{ p: 2, backgroundColor: '#6a1b9a', color: '#fff', display: 'flex', alignItems: 'center' }}>
            Ki<WarehouseSharp sx={{ ml: 1 }} />HoUse
          </Typography>
          {/* Sidebar Links */}
          <ListItem button component={Link} to="/dashboard" sx={animatedListItem}>
            <ListItemIcon><Dashboard /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/warehouse" sx={animatedListItem}>
            <ListItemIcon><Warehouse /></ListItemIcon>
            <ListItemText primary="Warehouse" />
          </ListItem>
          <ListItem button component={Link} to="/manageitem" sx={animatedListItem}>
            <ListItemIcon><Assignment /></ListItemIcon>
            <ListItemText primary="Manage Items" />
          </ListItem>
          <ListItem button component={Link} to="/allotment" sx={animatedListItem}>
            <ListItemIcon><ListAlt /></ListItemIcon>
            <ListItemText primary="Rack Management" />
          </ListItem>
          <ListItem button component={Link} to="/category" sx={animatedListItem}>
            <ListItemIcon><Category /></ListItemIcon>
            <ListItemText primary="Category" />
          </ListItem>
          <ListItem button component={Link} to="/supplier" sx={animatedListItem}>
            <ListItemIcon><LocalShipping /></ListItemIcon>
            <ListItemText primary="Supplier" />
          </ListItem>
        </List>
      </div>
      <Divider sx={{ my: 2 }} />
      {/* Sidebar Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', marginTop: 'auto' }}>
        <img src={logo} alt="Company Logo" style={{ maxWidth: '100px', marginBottom: '8px' }} />
        <Typography variant="caption" sx={{ color: '#6a1b9a' }}>
          &copy; 2024 KiaviSuntechSolutions
        </Typography>
      </div>
    </Drawer>
  );
};

export default AdminSidebar;
