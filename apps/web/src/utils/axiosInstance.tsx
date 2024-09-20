import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  // Get the token from cookies instead of localStorage
  const token = Cookies.get('token');

  console.log('token from cookie:', token);

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
