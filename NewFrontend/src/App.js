// src/App.js
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { themeSettings } from './theme';
import { useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from "./scenes/dashboard";
import Layout from './scenes/layout';
import Product from './scenes/products/Product';
import Category from './scenes/category/Category';
import Login from './scenes/Login/Login';
import Supplier from './scenes/supplier/Supplier';
//import ItemTable from './scenes/items/ItemTable';
import ManageItem from './scenes/items/ManageItem';
import RackForm from './scenes/RackManagement/RackForm';
import RackSlotForm from './scenes/RackManagement/RackSlotForm';
import RackItemForm from './scenes/RackManagement/RackItemForm';
import StockMovementTable from './scenes/movement/StockMovementTable';
import DetailsPage from './scenes/movement/DetailsPage';

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  // Manage authentication state based on localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Function to handle successful login
  const handleLoginSuccess = () => {
    console.log('Login successful! User is authenticated.');
    setIsAuthenticated(true); // Set authenticated state to true
  };

  return (
    <div className='app'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Public Route for login */}
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

            {/* Protected Routes wrapped in Layout */}
            {isAuthenticated ? (
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Product />} />
                <Route path="/category" element={<Category />} />
                <Route path="/supplier" element={<Supplier />}/>
                <Route path="/item" element={<ManageItem/>}/>
                <Route path="/racks" element={<RackForm/>}/>
                <Route path="/rack-slot" element={<RackSlotForm/>}/>
                <Route path="/rackForm" element={<RackItemForm/>}/>
                <Route path="/movementTable" element={<StockMovementTable />}/>
                <Route path="details" element={<DetailsPage/>}/>

              
              
              </Route>
            ) : (
              <Route path="/" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
