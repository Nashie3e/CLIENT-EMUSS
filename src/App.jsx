import React from 'react';
import { 
  createBrowserRouter, 
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import StaffLayout from './layouts/StaffLayout';
import ViewTickets from './pages/ict-coor/ViewTickets';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import TroubleshootingForm from './components/TroubleshootingForm';
import TicketCategories from './pages/TicketCategories.jsx';
import TrackTicket from './pages/TrackTicket.jsx';
import AccountManagementForm from './components/AccountManagementForm';
import DocumentUploadForm from './components/DocumentUploadForm';
import TechnicalAssistanceForm from './components/TechnicalAssistanceForm';
import Dashboard from './pages/admin/Dashboard.jsx';
import ManageTickets from './pages/admin/ManageTickets.jsx';
import TicketDetails from './pages/admin/TicketDetails';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import FormBuilder from './pages/admin/FormBuilder';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/tickets" element={<TicketCategories />} />
      <Route path="/track-ticket" element={<TrackTicket />} />
      <Route path="/troubleshooting" element={<TroubleshootingForm />} />
      <Route path="/account" element={<AccountManagementForm />} />
      <Route path="/documents" element={<DocumentUploadForm />} />
      <Route path="/technical-assistance" element={<TechnicalAssistanceForm />} />

      {/* Staff Routes */}
      <Route
        path="/ict-coor"
        element={
          <ProtectedRoute allowedRoles={['STAFF']}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/ict-coor/tickets" replace />} />
        <Route path="tickets" element={<ViewTickets />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tickets" element={<ManageTickets />} />
        <Route path="tickets/:id" element={<TicketDetails />} />
        <Route path="reports" element={<Reports />} />
        <Route path="forms" element={<FormBuilder />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Route>
  )
);

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider 
          router={router} 
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App; 