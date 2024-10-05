import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch racks
export const fetchRacks = createAsyncThunk('movement/fetchRacks', async (token) => {
  const response = await axios.get('http://localhost:5000/api/racks', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

// Async thunk to fetch slots
export const fetchSlots = createAsyncThunk('movement/fetchSlots', async (token) => {
  const response = await axios.get('http://localhost:5000/api/rack-slots', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

const initialState = {
  racks: [],
  allSlots: [],
  loading: false,
  error: null,
  success: null,
};

const movementSlice = createSlice({
  name: 'movement',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching racks
      .addCase(fetchRacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRacks.fulfilled, (state, action) => {
        state.loading = false;
        state.racks = action.payload; // Set the fetched racks
      })
      .addCase(fetchRacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Set error message
      })
      // Handle fetching slots
      .addCase(fetchSlots.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.allSlots = action.payload; // Set the fetched slots
      })
      .addCase(fetchSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Set error message
      });
  },
});

// Thunk to move stock
export const moveStock = (movementData) => async (dispatch) => {
  const token = localStorage.getItem('token');
  try {
    dispatch(setLoading(true));
    const response = await axios.post('http://localhost:5000/api/stock-movements', movementData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    dispatch(setSuccess(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, setError, setSuccess } = movementSlice.actions;

// Selectors for accessing the state
export const selectRacks = (state) => state.movement.racks;
export const selectAllSlots = (state) => state.movement.allSlots;
export const selectLoading = (state) => state.movement.loading;
export const selectError = (state) => state.movement.error;

export default movementSlice.reducer;
