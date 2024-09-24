'use server'
import axios from 'axios';
import { cookies } from 'next/headers'; 

const BASE_API = process.env.NEXT_PUBLIC_BASE_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = cookies().get('next-auth.session-token')?.value;

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
