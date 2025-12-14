import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  
  const [loading] = useState(false);

  const login = async (email, password) => {
    try {
      const credentials = btoa(`${email}:${password}`);
      sessionStorage.setItem('auth', credentials);

      const response = await api.get('/auth/me');
      
      const userData = {
        email: email,
        nombre: response.data.nombre,
        rol: response.data.rol,
        id: response.data.id
      };

      sessionStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      sessionStorage.removeItem('auth');
      sessionStorage.removeItem('user');
      
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.status === 401) {
          errorMessage = 'Email o contraseña incorrectos';
        } else if (error.response.status === 404) {
          errorMessage = 'Usuario no encontrado';
        } else if (error.response.status === 500) {
          errorMessage = 'Error del servidor. Intenta más tarde';
        } else {
          errorMessage = error.response.data?.message || 'Error de autenticación';
        }
      } else if (error.request) {
        // No hubo respuesta del servidor
        errorMessage = 'No se pudo conectar con el servidor. Verifica que esté ejecutándose';
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const register = async (nombre, email, password) => {
    try {
      await api.post('/auth/register', {
        nombre,
        email,
        contrasena: password,
        rol: 'ROLE_USER'
      });
      
      // Después de registrar, hacer login automático
      return await login(email, password);
    } catch (error) {
      let errorMessage = 'Error al registrar usuario';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data || 'El email ya está registrado';
        } else if (error.response.status === 500) {
          errorMessage = 'Error del servidor. Intenta más tarde';
        } else {
          errorMessage = error.response.data?.message || error.response.data || 'Error al registrar';
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que esté ejecutándose';
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  const isAdmin = () => {
    return user?.rol === 'ROLE_ADMIN';
  };

  const isUser = () => {
    return user?.rol === 'ROLE_USER';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      isAdmin, 
      isUser,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
