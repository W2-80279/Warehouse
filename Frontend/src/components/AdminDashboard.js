import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [itemCounts, setItemCounts] = useState({
    totalItems: 0,
    totalUsers: 0,
    totalRacks: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard'); // Adjust API endpoint as needed
      setItemCounts(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to the Admin Dashboard!
      </Typography>
      <Typography paragraph>
        Use the navigation bar to explore different functionalities.
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Total Items
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {itemCounts.totalItems}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#388e3c', color: '#fff' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Total Users
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {itemCounts.totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#f57c00', color: '#fff' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Total Racks
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {itemCounts.totalRacks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AdminDashboard;
