// src/Login.js
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

const Login = ({ onLoginSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Response data:", result);

      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem('token', result.token);
        console.log("Login successful, token stored:", result.token);
        onLoginSuccess(); // Call the callback to set authentication state
        window.location.href = '/'; // Redirect to homepage or dashboard
      } else {
        setErrorMessage(result.message || 'Login failed. Please try again.');
        console.error("Login failed:", result.message);
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
      console.error("Server error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={6} md={4} component={Paper} elevation={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login
        </Typography>

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
            {...register('userName', { required: 'Username is required' })}
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
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

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
        </form>
      </Grid>
    </Grid>
  );
};

export default Login;
