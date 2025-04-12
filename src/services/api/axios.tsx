import axios, { InternalAxiosRequestConfig } from 'axios';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authString = localStorage.getItem('auth');
    let token: string | undefined;

    if (authString) {
      try {
        const authData = JSON.parse(authString) as { accessToken?: string };
        token = authData?.accessToken;
      } catch (err) {
        console.warn('Invalid auth data in localStorage', err);
      }
    }

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error: any) => Promise.reject(error)
);

export default axiosInstance;
