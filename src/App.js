
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ThemeDemo from './ThemeDemo';
import Admin from './pages/Admin';
import ProtectedRoute from './auth/ProtectedRoute';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      {!isAuthenticated ? (
        <>
          <Login />
          <ThemeDemo />
        </>
      ) : (
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
