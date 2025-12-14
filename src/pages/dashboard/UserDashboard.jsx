import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';
import './Dashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    puntos: 0,
    posicion: '-',
    pronosticos: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtener pronósticos y calcular puntos
        const pronosticosResponse = await api.get('/pronosticos/puntos');
        const pronosticosData = pronosticosResponse.data;
        
        console.log('Pronósticos data:', pronosticosData);
        
        // Calcular puntos totales de partidos finalizados
        const puntos = pronosticosData
          .filter(p => p.partidoFinalizado)
          .reduce((sum, p) => sum + p.puntosObtenidos, 0);
        
        // Total de pronósticos realizados
        const totalPronosticos = pronosticosData.length;

        console.log('Puntos calculados:', puntos);
        console.log('Total pronósticos:', totalPronosticos);

        // Obtener ranking para determinar la posición
        const rankingResponse = await api.get('/ranking');
        const apostadores = rankingResponse.data.filter(u => u.rol === 'ROLE_USER');
        console.log('Apostadores:', apostadores);
        console.log('User ID:', user?.id);
        
        const posicion = apostadores.findIndex(u => u.id === user?.id) + 1;
        console.log('Posición calculada:', posicion);

        setStats({
          puntos,
          posicion: posicion > 0 ? posicion : '-',
          pronosticos: totalPronosticos
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="dashboard-container user-dashboard">
      <Navbar />

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1 className="welcome-title">¡BIENVENIDO {user?.nombre?.split(' ')[0]?.toUpperCase()}!</h1>
          <p className="welcome-subtitle">Realiza tus pronósticos y compite por el primer lugar</p>
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-value">{stats.puntos}</span>
              <span className="stat-label">PUNTOS</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.posicion}</span>
              <span className="stat-label">POSICIÓN</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.pronosticos}</span>
              <span className="stat-label">PRONÓSTICOS</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card user-card" onClick={() => navigate('/partidos')}>
            <div className="card-icon">⚽</div>
            <h3>PARTIDOS DISPONIBLES</h3>
            <p>Realiza tus pronósticos para los próximos partidos</p>
            <button className="card-button">HACER PRONÓSTICOS</button>
          </div>

          <div className="dashboard-card user-card" onClick={() => navigate('/mis-pronosticos')}>
            <div className="card-icon">🎯</div>
            <h3>MIS PRONÓSTICOS</h3>
            <p>Revisa tus predicciones y puntos obtenidos</p>
            <button className="card-button">VER MIS PRONÓSTICOS</button>
          </div>

          <div className="dashboard-card user-card" onClick={() => navigate('/ranking')}>
            <div className="card-icon">🏆</div>
            <h3>RANKING</h3>
            <p>Mira tu posición en la tabla general</p>
            <button className="card-button">VER RANKING</button>
          </div>
        </div>

        <div className="info-section">
          <h3>📋 REGLAS DE PUNTUACIÓN</h3>
          <div className="rules-grid">
            <div className="rule-item">
              <span className="rule-points">5 pts</span>
              <span className="rule-desc">Resultado exacto</span>
            </div>
            <div className="rule-item">
              <span className="rule-points">3 pts</span>
              <span className="rule-desc">Aciertas ganador o empate</span>
            </div>
            <div className="rule-item">
              <span className="rule-points">1 pt</span>
              <span className="rule-desc">Aciertas goles de un equipo</span>
            </div>
            <div className="rule-item">
              <span className="rule-points">0 pts</span>
              <span className="rule-desc">Cualquier otro caso</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>Mundial Score 2026 - ¡Demuestra que eres el mejor!</p>
      </footer>
    </div>
  );
};

export default UserDashboard;
