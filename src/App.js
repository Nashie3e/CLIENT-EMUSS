import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ThemeDemo from './ThemeDemo';
import Admin from './pages/Admin';
import UserDashboard from './pages/UserDashboard';
import DentalConsultation from './pages/DentalConsultation';
import MedicalConsultation from './pages/MedicalConsultation';
import Appointments from './pages/Appointments';
import MedicalHistory from './pages/MedicalHistory';
import Profile from './pages/Profile';
import ProtectedRoute from './auth/ProtectedRoute';

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/theme" element={<ThemeDemo />} />

      {/* Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dental-consultation"
        element={
          <ProtectedRoute>
            <DentalConsultation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medical-consultation"
        element={
          <ProtectedRoute>
            <MedicalConsultation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medical-history"
        element={
          <ProtectedRoute>
            <MedicalHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            user?.role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/user-dashboard" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
