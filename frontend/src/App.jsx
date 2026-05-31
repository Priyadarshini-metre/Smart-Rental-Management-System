import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyFormPage from './pages/PropertyFormPage';
import TenantsPage from './pages/TenantsPage';
import BookingsPage from './pages/BookingsPage';
import PaymentsPage from './pages/PaymentsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Layout Wrapper
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Root Redirect component
const RootRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/properties" replace />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected App Routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/" element={<RootRedirect />} />

            {/* Admin Only Route */}
            <Route path="/dashboard" element={
              <ProtectedRoute adminOnly={true}>
                <DashboardPage />
              </ProtectedRoute>
            } />

            {/* Properties Routes */}
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/new" element={
              <ProtectedRoute adminOnly={true}>
                <PropertyFormPage />
              </ProtectedRoute>
            } />
            <Route path="/properties/edit/:id" element={
              <ProtectedRoute adminOnly={true}>
                <PropertyFormPage />
              </ProtectedRoute>
            } />

            {/* Tenants Routes (Admin Only) */}
            <Route path="/tenants" element={
              <ProtectedRoute adminOnly={true}>
                <TenantsPage />
              </ProtectedRoute>
            } />

            {/* Bookings Route */}
            <Route path="/bookings" element={<BookingsPage />} />

            {/* Payments Route (Admin Only) */}
            <Route path="/payments" element={
              <ProtectedRoute adminOnly={true}>
                <PaymentsPage />
              </ProtectedRoute>
            } />

            {/* Profile Route */}
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
