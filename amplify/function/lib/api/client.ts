
import { API_CONFIG } from './api';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ExternalItemPage<T> {
  count: number;
  data: T[];
  next_cursor: string | null;
}

export class ApiClient {
  private client: AxiosInstance;
  private url: string;
  private config: AxiosRequestConfig;
  constructor() {
    this.config = JSON.parse(process.env.REQUEST_CONFIG!);
    this.url = this.config.baseURL! + this.config.url!;

    this.client = axios.create({
      baseURL: API_CONFIG.baseUrl,
      headers: {
        ...API_CONFIG.defaultHeaders,
      },
      withCredentials: API_CONFIG.cors.credentials,
      timeout: 30000, // 30 second timeout
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

    this.client.defaults.headers.common['Authorization'] = `Bearer ${API_CONFIG.apiKey}`;

  }

  async get<T>(cursor?: string | null): Promise<T> {
    this.config.params.cursor = cursor || null;
    try {
      const response = await this.client.get<T>(this.url, this.config);
      return response.data;
    } catch (error) {
      console.error('GET request failed:', this.url, error);
      throw error;
    }
  }

  async fetch<T>(cursor?: string | null): Promise<ExternalItemPage<T>> {
    try {

      return await this.get<ExternalItemPage<T>>(cursor);

    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response);
        if (error.response?.status == 429) {
          // Too many requests, wait and try again
          console.log("Too many requests, wait and try again");
          await new Promise(resolve => setTimeout(resolve, 5000));
          return this.fetch();
        }
        console.error(`AxiosError (${error.response?.status}) in fetchItems:`, error);
      }
      throw error;
    }
  }

}

export const apiClient = new ApiClient();


