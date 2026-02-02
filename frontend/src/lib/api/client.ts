import axios, { AxiosError, AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'auth_token';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_KEY);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      if (status === 401) {
        console.error('Unauthorized');
      }

      if (status === 404) {
        console.error('Resource not found');
      }

      if (status >= 500) {
        console.error('Server error');
      }

      return Promise.reject({
        status,
        message: data?.message || error.message,
        error: data?.error || 'Unknown error',
      });
    }

    if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Network error',
        error: 'NETWORK_ERROR',
      });
    }

    return Promise.reject({
      status: 0,
      message: error.message,
      error: 'REQUEST_ERROR',
    });
  }
);
