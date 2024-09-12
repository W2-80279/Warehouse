import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import Warehouse from './pages/Warehouse';
import ManageItem from './pages/ManageItem'; // Ensure this is correctly imported
import RackManagement from './pages/Rackmanagement';
import CategoryPage from './pages/Category'; // Ensure this is correctly imported
import SupplierPage from './pages/Supplier'; // Ensure this is correctly imported

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';  // Ensure this is correctly imported
import RackItemForm from './pages/management/RackItemForm';

// Import the context provider
import { RackItemProvider } from './pages/management/RackItemContext';
import RackForm from './pages/management/RackForm';
import RackSlotForm from './pages/management/RackSlotForm';
import AdminSidebar from './components/AdminSidebar';
//import StockMovementList from './pages/management/StockMovementList';
//import StockMovementPage from './pages/management/StockMovementPage'
import StockMovementForm from './pages/management/StockMovementForm';
function App() {
  return (
    <Router>
      <RackItemProvider> {/* Wrap routes with RackItemProvider */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes wrapped with Layout and ProtectedRoute */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse"
            element={
              <ProtectedRoute>
                <Layout>
                  <Warehouse />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manageitem"
            element={
              <ProtectedRoute>
                <Layout>
                  <ManageItem />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rackmanagement"
            element={
              <ProtectedRoute>
                <Layout>
                  <RackManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoryPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier"
            element={
              <ProtectedRoute>
                <Layout>
                  <SupplierPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/allotment"
            element={
              <ProtectedRoute>
                <Layout>
                  <RackItemForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/racks"
            element={
              <ProtectedRoute>
                <Layout>
                  <RackForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rack-slot"
            element={
              <ProtectedRoute>
                <Layout>
                  <RackSlotForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sidebar"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminSidebar />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/stock-move"
            element={
              <ProtectedRoute>
                <Layout>
                <StockMovementPage/>
                </Layout>
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/move-list"
            element={
              <ProtectedRoute>
                <Layout>
                  <StockMovementForm/>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </RackItemProvider>
    </Router>
  );
}

export default App;
