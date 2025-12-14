import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';
import '../dashboard/Dashboard.css';
import './Pronosticos.css';

const PronosticosPage = () => {
  const [pronosticos, setPronosticos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPronosticos();
  }, []);

  const cargarPronosticos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pronosticos/puntos');
      setPronosticos(response.data);
    } catch (error) {
      console.error('Error al cargar pronósticos:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = () => {
    const finalizados = pronosticos.filter(p => p.partidoFinalizado);
    const totalPuntos = finalizados.reduce((sum, p) => sum + p.puntosObtenidos, 0);
    const aciertosExactos = finalizados.filter(p => p.puntosObtenidos === 5).length;
    const aciertosGanador = finalizados.filter(p => p.puntosObtenidos === 3).length;
    
    return {
      totalPronosticos: pronosticos.length,
      pronosticosFinalizados: finalizados.length,
      totalPuntos,
      aciertosExactos,
      aciertosGanador
    };
  };

  const stats = calcularEstadisticas();

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="page-header">
          <h1 className="page-title">🎯 MIS PRONÓSTICOS</h1>
          <p className="page-subtitle">Revisa tus predicciones y puntos obtenidos</p>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-number">{stats.totalPronosticos}</div>
            <div className="stat-label">Pronósticos Totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚽</div>
            <div className="stat-number">{stats.pronosticosFinalizados}</div>
            <div className="stat-label">Partidos Finalizados</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-number">{stats.totalPuntos}</div>
            <div className="stat-label">Puntos Totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-number">{stats.aciertosExactos}</div>
            <div className="stat-label">Resultados Exactos</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-number">{stats.aciertosGanador}</div>
            <div className="stat-label">Ganador Acertado</div>
          </div>
        </div>

        <div className="pronosticos-container">
          {loading ? (
            <div className="loading-message">Cargando pronósticos...</div>
          ) : pronosticos.length === 0 ? (
            <div className="empty-message">
              <div className="empty-icon">📭</div>
              <h3>No has realizado pronósticos aún</h3>
              <p>Ve a la sección de PARTIDOS para comenzar a apostar</p>
            </div>
          ) : (
            pronosticos.map((pronostico) => (
              <div key={pronostico.partidoId} className={`pronostico-card ${pronostico.partidoFinalizado ? 'finalizado' : 'pendiente'}`}>
                <div className="pronostico-header">
                  <div className="partido-info">
                    <h3>{pronostico.equipoLocal} VS {pronostico.equipoVisitante}</h3>
                  </div>
                  <div className={`estado-badge ${pronostico.partidoFinalizado ? 'finalizado' : 'pendiente'}`}>
                    {pronostico.partidoFinalizado ? 'FINALIZADO' : 'PENDIENTE'}
                  </div>
                </div>

                <div className="pronostico-body">
                  <div className="pronostico-section">
                    <div className="section-title">TU PRONÓSTICO</div>
                    <div className="marcador">
                      {pronostico.golesLocalPredicho} - {pronostico.golesVisitantePredicho}
                    </div>
                  </div>

                  {pronostico.partidoFinalizado && (
                    <>
                      <div className="pronostico-section">
                        <div className="section-title">RESULTADO REAL</div>
                        <div className="marcador resultado">
                          {pronostico.golesLocalReal} - {pronostico.golesVisitanteReal}
                        </div>
                      </div>

                      <div className="pronostico-section">
                        <div className="section-title">PUNTOS OBTENIDOS</div>
                        <div className={`puntos puntos-${pronostico.puntosObtenidos}`}>
                          {pronostico.puntosObtenidos} pts
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PronosticosPage;
