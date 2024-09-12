import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useForm } from 'react-hook-form';
import './Signup.css'; // Import the updated CSS

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch roles from backend when component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/role');
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        setErrorMessage('Failed to load roles');
      }
    };

    fetchRoles();
  }, []);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const onSubmit = async (data) => {
    setErrorMessage(''); // Reset any previous error
    setSuccessMessage('');

    // Append selected role to the form data
    const formData = { ...data, roleId: selectedRole };

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('User registered successfully! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000); // Redirect to login after 2 seconds
      } else {
        setErrorMessage(result.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="signup-bg">
      <Container maxWidth="sm">
        <Box className="signup-container">
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Signup
            </Typography>
            {/* <Typography variant="body1" color="textSecondary">
              Create a new account
            </Typography> */}
          </Box>

          {errorMessage && (
            <Typography color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}

          {successMessage && (
            <Typography color="primary" sx={{ mb: 2 }}>
              {successMessage}
            </Typography>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Full Name"
              {...register('fullName', { required: 'Full name is required' })}
              fullWidth
              margin="normal"
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
            <TextField
              label="Username"
              {...register('userName', { required: 'Username is required' })}
              fullWidth
              margin="normal"
              error={!!errors.userName}
              helperText={errors.userName?.message}
            />
            <TextField
              label="Email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: 'Invalid email address',
                },
              })}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              label="Phone"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Invalid phone number',
                },
              })}
              fullWidth
              margin="normal"
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            {/* Dropdown for Role */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={selectedRole}
                label="Role"
                onChange={handleRoleChange}
              >
                {roles.map((role) => (
                  <MenuItem key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Signup
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default Signup;
