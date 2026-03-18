import axios from 'axios';

const MEDALLAS_BASE_URL =
  import.meta.env.VITE_MEDALLAS_API_URL || 'https://medallas-ms-tey65.ondigitalocean.app/api';

const medallasApi = axios.create({
  baseURL: MEDALLAS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

medallasApi.interceptors.request.use(
  (config) => {
    const auth = sessionStorage.getItem('auth');
    if (auth) {
      config.headers.Authorization = `Basic ${auth}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const obtenerMisLogros = async () => {
  const response = await medallasApi.get('/logros/mis-medallas');
  return response.data || [];
};

export default medallasApi;
