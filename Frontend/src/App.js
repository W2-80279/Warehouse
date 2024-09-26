import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import Warehouse from './pages/Warehouse';
import ManageItem from './pages/items/ManageItem'; // Ensure this is correctly imported
import RackManagement from './pages/Rackmanagement';
import CategoryPage from './pages/Category'; // Ensure this is correctly imported
import SupplierPage from './pages/Supplier'; // Ensure this is correctly imported
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; // Ensure this is correctly imported
import RackItemForm from './pages/management/RackItemForm';
import { RackItemProvider } from './pages/movement/RackItemContext'; // Ensure this is correctly imported
import RackForm from './pages/management/RackForm';
import RackSlotForm from './pages/management/RackSlotForm';
import AdminSidebar from './components/AdminSidebar';
import StockMovementForm from './pages/movement/StockMovementForm';
import FileUpload from './pages/export/FileUpload';
import DataTable from './pages/export/DataTable';
import StockMovementTable from './pages/movement/StockMovementTable';

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
          <Route
            path="/move-list"
            element={
              <ProtectedRoute>
                <Layout>
                  <StockMovementForm /> {/* This component uses the context */}
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/export"
            element={
              <ProtectedRoute>
                <Layout>
                  <FileUpload />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/datatables/:tableName"
            element={
              <ProtectedRoute>
                <Layout>
                  <DataTable />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/movement-table"
            element={
              <ProtectedRoute>
                <Layout>
                  <StockMovementTable />
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
