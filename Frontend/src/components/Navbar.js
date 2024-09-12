// src/Navbar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, TextField, InputAdornment } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import WarehouseIcon from '@mui/icons-material/Store';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';





const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#ffffff', // White background
          backdropFilter: 'blur(5px)', // Slight blur effect
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Shadow effect
          color: '#6a1b9a', // Purple text color
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)', // Light border
          zIndex: 1200 // Ensure it's on top
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, color: '#6a1b9a' }} // Purple icon
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
           Ki<WarehouseIcon/>HoUse
            
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              mr: 2,
              backgroundColor: '#f5f5f5', // Light grey background for input
              borderRadius: '4px',
              '& .MuiInputBase-root': {
                color: '#6a1b9a', // Purple text color
              },
              '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                color: '#6a1b9a', // Purple icon
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ManageSearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button color="inherit" startIcon={<DashboardIcon sx={{ color: '#6a1b9a' }} />} onClick={() => navigate('/dashboard')}>
            
          </Button>
          <Button color="inherit" startIcon={<ManageSearchIcon sx={{ color: '#6a1b9a' }} />} onClick={() => navigate('/manageitem')}>
            
          </Button>
          <Button color="inherit" startIcon={<WarehouseIcon sx={{ color: '#6a1b9a' }} />} onClick={() => navigate('/warehouse')}>
            
          </Button>
          <Button color="inherit" startIcon={<ListAltIcon sx={{ color: '#6a1b9a' }} />} onClick={() => navigate('/allotment')}>
          
          </Button>
          <Button color="inherit" startIcon={<LogoutIcon sx={{ color: '#6a1b9a' }} />} onClick={handleLogout}>
           
          </Button>
        </Toolbar>
      </AppBar>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
