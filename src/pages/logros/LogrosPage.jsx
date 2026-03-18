import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import { obtenerMisLogros } from '../../services/medallasApi';
import auraImg from '../../assets/aura.jpg';
import borreImg from '../../assets/borre.jpeg';
import hampaImg from '../../assets/hampa.jpg';
import ludopataImg from '../../assets/ludopata.png';
import oraculoImg from '../../assets/oraculo.png';
import tibioImg from '../../assets/tibio.png';
import errorIcon from '../../assets/error-icon.svg';
import '../dashboard/Dashboard.css';
import './Logros.css';

const ORDEN_MEDALLAS = ['LUDOPATA', 'ORACULO', 'TIBIO', 'BORRE', 'AURA', 'HAMPA'];

const MEDALLAS_INFO = {
  LUDOPATA: {
    nombre: 'Ludopata',
    descripcion: 'Realiza al menos un pronostico en el torneo.',
    imagen: ludopataImg,
  },
  ORACULO: {
    nombre: 'Oraculo',
    descripcion: 'Acerta un marcador exacto para obtener 5 puntos.',
    imagen: oraculoImg,
  },
  TIBIO: {
    nombre: 'Tibio',
    descripcion: 'Acerta el resultado de un empate en un partido',
    imagen: tibioImg,
  },
  BORRE: {
    nombre: 'Borre',
    descripcion: 'Acumula 5 o mas pronosticos con 0 puntos.',
    imagen: borreImg,
    destacada: true,
  },
  AURA: {
    nombre: 'Aura',
    descripcion: 'Acumula 15 puntos en total.',
    imagen: auraImg,
    destacada: true,
  },
  HAMPA: {
    nombre: 'Hampa',
    descripcion: 'Acumula 20 puntos en total.',
    imagen: hampaImg,
    destacada: true,
  },
};

const LogrosPage = () => {
  const [logrosGanados, setLogrosGanados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorServicio, setErrorServicio] = useState(false);

  const cargarLogros = async () => {
    try {
      setLoading(true);
      setErrorServicio(false);
      const logros = await obtenerMisLogros();
      setLogrosGanados(logros);
    } catch (error) {
      console.error('MS-Medallas no disponible:', error);
      setErrorServicio(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLogros();
  }, []);

  const medallas = useMemo(() => {
    const logrosPorCodigo = new Map(logrosGanados.map((logro) => [logro.codigo, logro]));

    return ORDEN_MEDALLAS.map((codigo) => {
      const logro = logrosPorCodigo.get(codigo);
      const metadata = MEDALLAS_INFO[codigo];
      return {
        codigo,
        nombre: logro?.nombre || metadata.nombre,
        descripcion: logro?.descripcion || metadata.descripcion,
        imagen: metadata.imagen,
        destacada: Boolean(metadata.destacada),
        obtenida: Boolean(logro),
      };
    });
  }, [logrosGanados]);

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        <div className="page-header">
          <h1 className="page-title">🏅 LOGROS Y MEDALLAS</h1>
          <p className="page-subtitle">Desbloquea insignias segun tu rendimiento en el Mundial</p>
        </div>

        {loading ? (
          <div className="loading-message">Cargando logros...</div>
        ) : errorServicio ? (
          <div className="logros-error-box">
            <div className="empty-icon-wrap">
              <img className="empty-icon" src={errorIcon} alt="Servicio no disponible" />
            </div>
            <h3>Servicio de medallas no disponible</h3>
            <p>Lo sentimos, no se pudieron cargar tus logros en este momento.</p>
            <button className="btn-reintentar-logros" onClick={cargarLogros}>
              REINTENTAR
            </button>
          </div>
        ) : (
          <section className="logros-seccion">
            <h2 className="logros-seccion-titulo">MEDALLAS DISPONIBLES</h2>
            <div className="logros-grid">
              {medallas.map((medalla) => (
                <article
                  key={medalla.codigo}
                  className={`medalla-card ${medalla.obtenida ? 'obtenida' : 'bloqueada'} ${
                    medalla.destacada ? 'destacada' : ''
                  }`}
                >
                  <span className="medalla-check">✓</span>
                  <div className="medalla-imagen-wrap">
                    <img className="medalla-imagen" src={medalla.imagen} alt={`Medalla ${medalla.nombre}`} />
                  </div>
                  <h3>{medalla.nombre}</h3>
                  <p>{medalla.descripcion}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default LogrosPage;
