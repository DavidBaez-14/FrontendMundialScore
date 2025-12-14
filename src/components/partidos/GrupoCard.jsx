
import './GrupoCard.css';

const GrupoCard = ({ grupo, onClick }) => {
  const grupoInfo = {
    A: { nombre: 'GRUPO A', equipos: ['🇲🇽 México', '🇿🇦 Sudáfrica', '🇰🇷 República de Corea', '🇩🇰 Dinamarca'] },
    B: { nombre: 'GRUPO B', equipos: ['🇨🇦 Canadá', '🇮🇹 Italia', '🇶🇦 Catar', '🇨🇭 Suiza'] },
    C: { nombre: 'GRUPO C', equipos: ['🇧🇷 Brasil', '🇲🇦 Marruecos', '🇭🇹 Haití', '🇪🇨 Escocia'] },
    D: { nombre: 'GRUPO D', equipos: ['🇺🇸 Estados Unidos', '🇵🇾 Paraguay', '🇦🇺 Australia', '🇷🇴 Rumania'] },
    E: { nombre: 'GRUPO E', equipos: ['🇩🇪 Alemania', '🇨🇼 Curazao', '🇨🇮 Costa de Marfil', '🇪🇨 Ecuador'] },
    F: { nombre: 'GRUPO F', equipos: ['🇳🇱 Países Bajos', '🇯🇵 Japón', '🇵🇱 Polonia', '🇹🇳 Túnez'] },
    G: { nombre: 'GRUPO G', equipos: ['🇧🇪 Bélgica', '🇪🇬 Egipto', '🇮🇷 Irán', '🇳🇿 Nueva Zelanda'] },
    H: { nombre: 'GRUPO H', equipos: ['🇪🇸 España', '🇨🇻 Cabo Verde', '🇸🇦 Arabia Saudí', '🇺🇾 Uruguay'] },
    I: { nombre: 'GRUPO I', equipos: ['🇫🇷 Francia', '🇸🇳 Senegal', '🇧🇴 Bolivia', '🇳🇴 Noruega'] },
    J: { nombre: 'GRUPO J', equipos: ['🇦🇷 Argentina', '🇩🇿 Argelia', '🇦🇹 Austria', '🇯🇴 Jordania'] },
    K: { nombre: 'GRUPO K', equipos: ['🇵🇹 Portugal', '🇨🇩 Rep. Del Congo', '🇺🇿 Uzbekistán', '🇨🇴 Colombia'] },
    L: { nombre: 'GRUPO L', equipos: ['󠁧󠁢🇮🇳 Inglaterra', '🇭🇷 Croacia', '🇬🇭 Ghana', '🇵🇦 Panamá'] }
  };

  const info = grupoInfo[grupo] || { nombre: `GRUPO ${grupo}`, equipos: [] };

  return (
    <div className="grupo-card" onClick={onClick}>
      <div className="grupo-header">
        <h3 className="grupo-nombre">{info.nombre}</h3>
        <span className="grupo-icon">⚽</span>
      </div>
      <div className="grupo-equipos">
        {info.equipos.map((equipo, index) => (
          <div key={index} className="grupo-equipo">
            {equipo}
          </div>
        ))}
      </div>
      <div className="grupo-footer">
        <button className="btn-ver-partidos">VER PARTIDOS</button>
      </div>
    </div>
  );
};

export default GrupoCard;
