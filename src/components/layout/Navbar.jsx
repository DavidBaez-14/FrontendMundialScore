import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = isAdmin() ? [
    { path: '/dashboard', label: 'INICIO', icon: '🏠' },
    { path: '/partidos', label: 'PARTIDOS', icon: '⚽' },
    { path: '/ranking', label: 'RANKING', icon: '🏆' }
  ] : [
    { path: '/dashboard', label: 'INICIO', icon: '🏠' },
    { path: '/partidos', label: 'PARTIDOS', icon: '⚽' },
    { path: '/mis-pronosticos', label: 'MIS PRONÓSTICOS', icon: '🎯' },
    { path: '/ranking', label: 'RANKING', icon: '🏆' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>MUNDIAL SCORE</h2>
        <span className="navbar-subtitle">
          {isAdmin() ? 'PANEL ADMINISTRADOR' : 'APUESTA Y GANA'}
        </span>
      </div>

      <div className="navbar-menu">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`navbar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="navbar-icon">{item.icon}</span>
            <span className="navbar-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="navbar-user">
        <div className="user-info">
          <span className="user-name">{user?.nombre}</span>
          <span className={`user-badge ${isAdmin() ? 'admin' : 'player'}`}>
            {isAdmin() ? 'ADMIN' : 'JUGADOR'}
          </span>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          SALIR
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
