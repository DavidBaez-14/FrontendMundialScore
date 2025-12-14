import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';
import '../dashboard/Dashboard.css';
import './TodosPronosticos.css';

const TodosPronosticos = () => {
  const [pronosticos, setPronosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroEquipo, setFiltroEquipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargarPronosticos();
  }, []);

  const cargarPronosticos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pronosticos');
      setPronosticos(response.data);
    } catch (error) {
      console.error('Error al cargar pronósticos:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = () => {
    const finalizados = pronosticos.filter(p => p.partido.finalizado);
    const totalPuntos = finalizados.reduce((sum, p) => sum + p.puntosObtenidos, 0);
    const aciertosExactos = finalizados.filter(p => p.puntosObtenidos === 5).length;
    
    return {
      totalPronosticos: pronosticos.length,
      pronosticosFinalizados: finalizados.length,
      pronosticosPendientes: pronosticos.length - finalizados.length,
      totalPuntos,
      aciertosExactos
    };
  };

  const pronosticosFiltrados = pronosticos.filter(p => {
    const matchUsuario = !filtroUsuario || 
      p.usuario.nombre.toLowerCase().includes(filtroUsuario.toLowerCase()) ||
      p.usuario.email.toLowerCase().includes(filtroUsuario.toLowerCase());
    
    const matchEquipo = !filtroEquipo ||
      p.partido.equipoLocal.toLowerCase().includes(filtroEquipo.toLowerCase()) ||
      p.partido.equipoVisitante.toLowerCase().includes(filtroEquipo.toLowerCase());
    
    const matchEstado = filtroEstado === 'todos' ||
      (filtroEstado === 'finalizados' && p.partido.finalizado) ||
      (filtroEstado === 'pendientes' && !p.partido.finalizado);
    
    return matchUsuario && matchEquipo && matchEstado;
  });

  const stats = calcularEstadisticas();

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="page-header">
          <h1 className="page-title">📊 TODOS LOS PRONÓSTICOS</h1>
          <p className="page-subtitle">Gestión y visualización de todas las apuestas</p>
        </div>

        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-number">{stats.totalPronosticos}</span>
            <span className="stat-text">Pronósticos Totales</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{stats.pronosticosFinalizados}</span>
            <span className="stat-text">Finalizados</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{stats.pronosticosPendientes}</span>
            <span className="stat-text">Pendientes</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{stats.totalPuntos}</span>
            <span className="stat-text">Puntos Totales</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{stats.aciertosExactos}</span>
            <span className="stat-text">Aciertos Exactos</span>
          </div>
        </div>

        <div className="filters-bar">
          <input
            type="text"
            placeholder="🔍 Buscar por usuario..."
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="🔍 Buscar por equipo..."
            value={filtroEquipo}
            onChange={(e) => setFiltroEquipo(e.target.value)}
            className="filter-input"
          />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos los estados</option>
            <option value="finalizados">Finalizados</option>
            <option value="pendientes">Pendientes</option>
          </select>
          <button onClick={cargarPronosticos} className="btn-refresh">
            🔄 Actualizar
          </button>
        </div>

        {loading ? (
          <div className="loading-message">Cargando pronósticos...</div>
        ) : pronosticosFiltrados.length === 0 ? (
          <div className="empty-message">
            <div className="empty-icon">📭</div>
            <h3>No se encontraron pronósticos</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="pronosticos-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Usuario</th>
                  <th>Partido</th>
                  <th>Pronóstico</th>
                  <th>Resultado Real</th>
                  <th>Puntos</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pronosticosFiltrados.map((pronostico, index) => (
                  <tr key={pronostico.id} className={pronostico.partido.finalizado ? 'finalizado' : 'pendiente'}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="usuario-cell">
                        <span className="usuario-nombre">{pronostico.usuario.nombre}</span>
                        <span className="usuario-email">{pronostico.usuario.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="partido-cell">
                        <strong>{pronostico.partido.equipoLocal}</strong>
                        <span className="vs">VS</span>
                        <strong>{pronostico.partido.equipoVisitante}</strong>
                        <span className="grupo-badge">Grupo {pronostico.partido.grupo}</span>
                      </div>
                    </td>
                    <td>
                      <span className="marcador-pronostico">
                        {pronostico.golesLocalPronosticados} - {pronostico.golesVisitantePronosticados ?? 0}
                      </span>
                    </td>
                    <td>
                      {pronostico.partido.finalizado ? (
                        <span className="marcador-real">
                          {pronostico.partido.golesLocal} - {pronostico.partido.golesVisitante}
                        </span>
                      ) : (
                        <span className="marcador-pendiente">-</span>
                      )}
                    </td>
                    <td>
                      {pronostico.partido.finalizado ? (
                        <span className={`puntos-badge puntos-${pronostico.puntosObtenidos}`}>
                          {pronostico.puntosObtenidos} pts
                        </span>
                      ) : (
                        <span className="puntos-badge puntos-pendiente">-</span>
                      )}
                    </td>
                    <td>
                      <span className={`estado-badge ${pronostico.partido.finalizado ? 'finalizado' : 'pendiente'}`}>
                        {pronostico.partido.finalizado ? '✓ Finalizado' : '⏳ Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="results-info">
          Mostrando {pronosticosFiltrados.length} de {pronosticos.length} pronósticos
        </div>
      </div>
    </div>
  );
};

export default TodosPronosticos;
