import type { AxiosRequestConfig } from 'axios';

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = typeof window !== 'undefined' ? 'client' : 'server';
  
  return fetch(`${BACKEND_URL}${config.url}`, {
    method: config.method,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
    body: config.data ? JSON.stringify(config.data) : undefined,
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw error;
    }
    
    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }
    
    return response.json();
  });
};

export default customInstance;
