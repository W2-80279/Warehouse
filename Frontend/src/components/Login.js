// src/Login.js
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Login.css'; // External CSS for additional styles

// Import your local images
import warehouseImage1 from '../staticimages/1.jpeg';  // Adjust the path if necessary
import warehouseImage2 from '../staticimages/2.jpeg';
import warehouseImage3 from '../staticimages/3.jpeg';
import logo from '../staticimages/KiaviSuntechSolutionsLogo-02.jpg'; // Import your logo

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage(''); // Clear any previous error messages
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Save token and user info to localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('userName', result.userName);
        localStorage.setItem('role', result.role);

        // Redirect to homepage or dashboard
        window.location.href = '/';
      } else {
        // Show error message from the server
        setErrorMessage(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Grid container component="main" className="login-grid" sx={{ height: '100vh' }}>
      {/* Image Carousel Side */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        className="carousel-container"
      >
        <Carousel autoPlay infiniteLoop showThumbs={false} interval={4000}>
          <div>
            <img src={warehouseImage1} alt="Warehouse 1" />
            <p className="legend">Efficient Warehouse Management</p>
          </div>
          <div>
            <img src={warehouseImage2} alt="Logistics" />
            <p className="legend">Streamlined Logistics</p>
          </div>
          <div>
            <img src={warehouseImage3} alt="Inventory" />
            <p className="legend">Manage Inventory Seamlessly</p>
          </div>
        </Carousel>
      </Grid>

      {/* Form Side with Background Blur and Animation */}
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Box}
        display="flex"
        justifyContent="center"
        alignItems="center"
        className="login-container background-animation" // Apply animation class
        sx={{
          backdropFilter: 'blur(10px)', // Blur effect
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slight transparency
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <img src={logo} alt="Company Logo" style={{ maxWidth: '150px', marginBottom: '16px' }} /> {/* Add logo here */}
              <Typography variant="h4" component="h1" gutterBottom>
                Login
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Welcome back! Please login to your account.
              </Typography>
            </Box>

            {/* Show error message if login fails */}
            {errorMessage && (
              <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                {errorMessage}
              </Typography>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register('userName', {
                  required: 'Username is required',
                })}
                error={!!errors.userName}
                helperText={errors.userName?.message}
              />

              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box mt={2} mb={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>
              </Box>
            </form>

            <Typography variant="body2" color="textSecondary" align="center">
              Don't have an account? &nbsp;&nbsp; <a href="/signup">Sign up</a>
            </Typography>
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Login;
