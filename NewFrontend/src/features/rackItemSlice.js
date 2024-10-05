import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  rackItems: [],
  loading: false,
  error: null,
};

const rackItemSlice = createSlice({
  name: 'rackItems',
  initialState,
  reducers: {
    setRackItems: (state, action) => {
      state.rackItems = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setRackItems, setLoading, setError } = rackItemSlice.actions;

export const fetchRackItems = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  try {
    dispatch(setLoading(true));
    const response = await axios.get('http://localhost:5000/api/rack-items/active', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setRackItems(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteRackItem = (id) => async (dispatch) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`http://localhost:5000/api/rack-items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(fetchRackItems()); // Re-fetch the updated data after deletion
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default rackItemSlice.reducer;
