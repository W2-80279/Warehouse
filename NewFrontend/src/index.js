import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import globalReducer from "./state";  // Add './' to make it a relative path
import rackItemReducer from './features/rackItemSlice';
import movementReducer from './features/movementSlice';  // Import the rackItemSlice you created
// import racksReducer from './features/rackSlice';  // If you want to add racksSlice in future, uncomment

import { Provider } from "react-redux";

const store = configureStore({
  reducer: {
    global: globalReducer,
    rackItems: rackItemReducer, // Add the rackItem slice to the reducer
    movement: movementReducer ,
    // racks: racksReducer,  // Uncomment and add racksReducer if needed
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
