
import { API_CONFIG } from './api';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ExternalItemPage<T> {
  count: number;
  data: T[];
  next_cursor: string | null;
}

interface FetchParms {
  cursor: string | null;
  include: string[],
  expand: string[],
  sort_by: string,
}

export class ApiClient<T> {
  private client: AxiosInstance;
  private url: string;
  private entities: string;
  private fetchParms: FetchParms;
  constructor(url: string, entities: string, fetchParms: FetchParms) {  // Add entities parameter
    this.url = API_CONFIG.baseUrl + url;
    this.entities = entities;
    this.fetchParms = fetchParms;

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


  async get(id: string): Promise<T> {
    const url = this.url + "/" + id;
    const response = await this.client.get<T>(url);
    return response.data;
  }


  async searchForEntityId(query: string): Promise<string | null> {

    const url = 'https://api.consigncloud.com/api/v1/search';
    const params: AxiosRequestConfig = {
      params: {
        query: query,
        entities: [this.entities],
      }
    };

    try {
      const response = await this.client.get(url, params);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.data.results.forEach((result: any) => {
        return result.document.id as string;
      });
      return null;
    } catch (error) {
      console.error('GET request failed:', this.url, error);
      throw error;
    }
  }

  async search(query: string): Promise<T | null> {
    const id = await this.searchForEntityId(query);
    return id ? this.get(id) : null;
  }

  async fetch(cursor?: string | null): Promise<ExternalItemPage<T>> {
    try {
      this.fetchParms.cursor = cursor ?? null;
      const response = await this.client.get<ExternalItemPage<T>>(this.url, { params: this.fetchParms });
      return response.data;
      // return await this.fetch<ExternalItemPage<T>>(cursor);

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

