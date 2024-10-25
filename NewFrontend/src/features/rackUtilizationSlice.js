// src/redux/rackUtilizationSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch rack utilization data
export const fetchRackUtilization = createAsyncThunk(
  'rackUtilization/fetchRackUtilization',
  async (filters) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token'); 

    // Make the API request with the token included in the headers
    const response = await axios.get('http://localhost:5000/api/rack-items', {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token
      },
      params: filters,
    });

    return response.data;
  }
);

const rackUtilizationSlice = createSlice({
  name: 'rackUtilization',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearData: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRackUtilization.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRackUtilization.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;

        // Log the successful response data
        console.log('Fetched rack utilization data:', action.payload);
      })
      .addCase(fetchRackUtilization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;

        // Log the error message
        console.error('Error fetching rack utilization data:', action.error.message);
      });
  },
});

export const { clearData } = rackUtilizationSlice.actions;

export default rackUtilizationSlice.reducer;
