import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import GrupoCard from '../../components/partidos/GrupoCard';
import PartidosModal from '../../components/partidos/PartidosModal';
import '../dashboard/Dashboard.css';
import './Partidos.css';

const PartidosPage = () => {
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="page-header">
          <h1 className="page-title">⚽ PARTIDOS DEL MUNDIAL</h1>
          <p className="page-subtitle">Selecciona un grupo para ver los partidos y realizar tus pronósticos</p>
        </div>

        <div className="grupos-grid">
          {grupos.map((grupo) => (
            <GrupoCard
              key={grupo}
              grupo={grupo}
              onClick={() => setSelectedGrupo(grupo)}
            />
          ))}
        </div>
      </div>

      {selectedGrupo && (
        <PartidosModal
          grupo={selectedGrupo}
          onClose={() => setSelectedGrupo(null)}
        />
      )}
    </div>
  );
};

export default PartidosPage;
