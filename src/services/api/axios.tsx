import axios, { InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authString = localStorage.getItem('token');
    let token: string | undefined;

    if (authString) {
      token = authString;
    }

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error: any) => Promise.reject(error)
);

export default axiosInstance;
