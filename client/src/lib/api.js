import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL });

// Attach token on every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('convohub_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
