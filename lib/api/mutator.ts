import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials if needed for auth
});

// Request interceptor for adding auth tokens if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage if it exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        // Optionally redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export const customInstance = <T>(
  url: string,
  options?: any
): Promise<T> => {
  // Extract signal if present (from react-query)
  const { signal, ...axiosConfig } = options || {};
  
  return axiosInstance
    .request<T>({ 
      url, 
      signal,
      ...axiosConfig 
    })
    .then((response: AxiosResponse<T>) => response.data);
};

export default customInstance;
