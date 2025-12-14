import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar autenticación en cada request
api.interceptors.request.use(
  (config) => {
    const auth = sessionStorage.getItem('auth');
    if (auth) {
      config.headers.Authorization = `Basic ${auth}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir si el error 401 NO es del endpoint de login o registro
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // No redirigir si es el endpoint /auth/me (usado durante login)
      if (!url.includes('/auth/me') && !url.includes('/auth/register')) {
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;