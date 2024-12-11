import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from './config/api';

export class ApiClient {
  private client: AxiosInstance;

  constructor(config: AxiosRequestConfig = {}) {
    this.client = axios.create({
      baseURL: '/api',
      headers: {
        ...API_CONFIG.defaultHeaders,
        'Accept': 'application/json',
      },
      withCredentials: false,
      timeout: 30000, // 30 second timeout
      ...config,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log('Making request to:', config.url);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log('Received response from:', response.config.url);
        return response;
      },
      (error) => {
        if (error.response) {
          // Server responded with a status code outside of 2xx
          console.error('API Error:', {
            status: error.response.status,
            data: error.response.data,
            url: error.config?.url,
          });
        } else if (error.request) {
          // Request was made but no response received
          console.error('Network Error:', {
            message: error.message,
            url: error.config?.url,
          });
        } else {
          // Error in request configuration
          console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string) {
    if (!token) {
      delete this.client.defaults.headers.common['Authorization'];
      return;
    }
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      console.error('GET request failed:', url, error);
      throw error;
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error('POST request failed:', url, error);
      throw error;
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error('PUT request failed:', url, error);
      throw error;
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      console.error('DELETE request failed:', url, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();