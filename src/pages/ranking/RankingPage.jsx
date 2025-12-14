import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';
import '../dashboard/Dashboard.css';
import './Ranking.css';

const RankingPage = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarRanking();
  }, []);

  const cargarRanking = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ranking');
      // Filtrar solo usuarios apostadores (ROLE_USER)
      const apostadores = response.data.filter(usuario => usuario.rol === 'ROLE_USER');
      setRanking(apostadores);
    } catch (error) {
      console.error('Error al cargar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (posicion) => {
    if (posicion === 1) return '🥇';
    if (posicion === 2) return '🥈';
    if (posicion === 3) return '🥉';
    return `${posicion}°`;
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="page-header">
          <h1 className="page-title">🏆 TABLA DE POSICIONES</h1>
          <p className="page-subtitle">Clasificación general de apostadores</p>
        </div>

        {loading ? (
          <div className="loading-message">Cargando ranking...</div>
        ) : ranking.length === 0 ? (
          <div className="empty-message">
            <div className="empty-icon">📊</div>
            <h3>Aún no hay apostadores con puntos</h3>
            <p>¡Sé el primero en aparecer en el ranking!</p>
          </div>
        ) : (
          <div className="ranking-container">
            <div className="podium">
              {ranking.slice(0, 3).map((usuario, index) => (
                <div key={usuario.id} className={`podium-item podium-${index + 1}`}>
                  <div className="podium-medal">{getMedalIcon(index + 1)}</div>
                  <div className="podium-name">{usuario.nombre}</div>
                  <div className="podium-points">{usuario.puntosTotales} pts</div>
                </div>
              ))}
            </div>

            <div className="ranking-table">
              <table>
                <thead>
                  <tr>
                    <th>POSICIÓN</th>
                    <th>APOSTADOR</th>
                    <th>EMAIL</th>
                    <th>PUNTOS</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((usuario, index) => (
                    <tr key={usuario.id} className={index < 3 ? 'top-three' : ''}>
                      <td className="posicion">
                        <span className="posicion-badge">{getMedalIcon(index + 1)}</span>
                      </td>
                      <td className="nombre">{usuario.nombre}</td>
                      <td className="email">{usuario.email}</td>
                      <td className="puntos">
                        <span className="puntos-badge">{usuario.puntosTotales}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingPage;
