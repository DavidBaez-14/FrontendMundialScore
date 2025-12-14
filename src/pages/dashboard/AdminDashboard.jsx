import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import './Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container admin-dashboard">
      <Navbar />

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1 className="welcome-title">¡BIENVENIDO ADMINISTRADOR!</h1>
          <p className="welcome-subtitle">Panel de control del Mundial 2026</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card admin-card" onClick={() => navigate('/partidos')}>
            <div className="card-icon">⚽</div>
            <h3>GESTIONAR PARTIDOS</h3>
            <p>Actualizar resultados y recalcular puntos</p>
            <button className="card-button">IR A PARTIDOS</button>
          </div>

          <div className="dashboard-card admin-card" onClick={() => navigate('/pronosticos')}>
            <div className="card-icon">📊</div>
            <h3>TODOS LOS PRONÓSTICOS</h3>
            <p>Ver y gestionar apuestas de usuarios</p>
            <button className="card-button">VER PRONÓSTICOS</button>
          </div>

          <div className="dashboard-card admin-card" onClick={() => navigate('/ranking')}>
            <div className="card-icon">🏆</div>
            <h3>RANKING GENERAL</h3>
            <p>Ver tabla de posiciones de apostadores</p>
            <button className="card-button">VER RANKING</button>
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>Mundial Score 2026 - Sistema de Apuestas</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
