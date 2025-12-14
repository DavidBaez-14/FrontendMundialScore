import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './PartidosModal.css';

const PartidosModal = ({ grupo, onClose }) => {
  const { isAdmin } = useAuth();
  const [fecha, setFecha] = useState(1);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pronosticos, setPronosticos] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    cargarPartidos();
  }, [grupo, fecha]);

  const cargarPartidos = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/partidos/grupo/${grupo}/fecha/${fecha}`);
      setPartidos(response.data);
      
      // Cargar pronósticos existentes del usuario
      if (!isAdmin()) {
        const pronosticosResponse = await api.get('/pronosticos/pronosticos-usuario');
        const misPronosticos = {};
        pronosticosResponse.data.forEach(p => {
          misPronosticos[p.partido.id] = {
            golesLocal: p.golesLocalPronosticados,
            golesVisitante: p.golesVisitantePronosticados
          };
        });
        setPronosticos(misPronosticos);
      }
    } catch (error) {
      console.error('Error al cargar partidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePronosticoChange = (partidoId, campo, valor) => {
    setPronosticos(prev => ({
      ...prev,
      [partidoId]: {
        ...prev[partidoId],
        [campo]: parseInt(valor) || 0
      }
    }));
  };

  const guardarPronostico = async (partidoId) => {
    const pronostico = pronosticos[partidoId];
    if (!pronostico || pronostico.golesLocal === undefined || pronostico.golesVisitante === undefined) {
      setMessage('⚠️ Debes ingresar ambos marcadores');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      await api.post('/pronosticos', {
        partidoId: partidoId,
        golesLocal: pronostico.golesLocal,
        golesVisitante: pronostico.golesVisitante
      });
      setMessage('✅ Pronóstico guardado exitosamente');
      setTimeout(() => setMessage(''), 3000);
      cargarPartidos();
    } catch {
      setMessage('❌ Error al guardar pronóstico');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const guardarResultado = async (partidoId) => {
    const resultado = pronosticos[partidoId];
    if (!resultado || resultado.golesLocal === undefined || resultado.golesVisitante === undefined) {
      setMessage('⚠️ Debes ingresar ambos marcadores');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      await api.put(`/partidos/${partidoId}/resultado`, {
        golesLocal: resultado.golesLocal,
        golesVisitante: resultado.golesVisitante
      });
      setMessage('✅ Resultado actualizado y puntos recalculados');
      setTimeout(() => setMessage(''), 3000);
      cargarPartidos();
    } catch {
      setMessage('❌ Error al actualizar resultado');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>GRUPO {grupo}</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="fecha-selector">
          <label>FECHA:</label>
          <select value={fecha} onChange={(e) => setFecha(parseInt(e.target.value))}>
            <option value={1}>Fecha 1</option>
            <option value={2}>Fecha 2</option>
            <option value={3}>Fecha 3</option>
          </select>
        </div>

        {message && <div className="modal-message">{message}</div>}

        <div className="partidos-list">
          {loading ? (
            <div className="loading">Cargando partidos...</div>
          ) : partidos.length === 0 ? (
            <div className="no-partidos">No hay partidos para esta fecha</div>
          ) : (
            partidos.map((partido) => (
              <div key={partido.id} className={`partido-item ${partido.finalizado ? 'finalizado' : ''}`}>
                <div className="partido-equipos">
                  <div className="equipo-nombre">{partido.equipoLocal}</div>
                  <div className="vs">VS</div>
                  <div className="equipo-nombre">{partido.equipoVisitante}</div>
                </div>

                {partido.finalizado && (
                  <div className="resultado-final">
                    <span className="resultado-label">RESULTADO:</span>
                    <span className="marcador">
                      {partido.golesLocal} - {partido.golesVisitante}
                    </span>
                  </div>
                )}

                {!partido.finalizado && (
                  <div className="pronostico-inputs">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={pronosticos[partido.id]?.golesLocal ?? ''}
                      onChange={(e) => handlePronosticoChange(partido.id, 'golesLocal', e.target.value)}
                      className="input-goles"
                    />
                    <span className="separator">-</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={pronosticos[partido.id]?.golesVisitante ?? ''}
                      onChange={(e) => handlePronosticoChange(partido.id, 'golesVisitante', e.target.value)}
                      className="input-goles"
                    />
                    <button
                      onClick={() => isAdmin() ? guardarResultado(partido.id) : guardarPronostico(partido.id)}
                      className="btn-guardar"
                    >
                      {isAdmin() ? 'GUARDAR RESULTADO' : 'APOSTAR'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PartidosModal;
