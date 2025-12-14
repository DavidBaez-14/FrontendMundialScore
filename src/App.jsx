import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import UserDashboard from './pages/dashboard/UserDashboard';
import PartidosPage from './pages/partidos/PartidosPage';
import PronosticosPage from './pages/pronosticos/PronosticosPage';
import RankingPage from './pages/ranking/RankingPage';
import './App.css';

function DashboardRouter() {
  const { user } = useAuth();
  
  if (user?.rol === 'ROLE_ADMIN') {
    return <AdminDashboard />;
  } else if (user?.rol === 'ROLE_USER') {
    return <UserDashboard />;
  }
  
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/partidos" 
            element={
              <ProtectedRoute>
                <PartidosPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mis-pronosticos" 
            element={
              <ProtectedRoute>
                <PronosticosPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ranking" 
            element={
              <ProtectedRoute>
                <RankingPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
