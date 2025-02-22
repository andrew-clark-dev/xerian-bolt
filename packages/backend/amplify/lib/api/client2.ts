import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from 'axios';

export const API_CONFIG: CreateAxiosDefaults = {
  baseURL: process.env.BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*', // Allow all origins
    'Authorization': 'Bearer ' + process.env.API_KEY,
  },
  withCredentials: true,
  timeout: 30000, // 30 second timeout
};

export interface Page<T> {
  count: number | null;
  data: T[];
  next_cursor: string | null;
}

export interface Params {
  [name: string]: string | number | (string | number)[] | null;
}

export class Client<T> {
  private client: AxiosInstance;
  private path: string = '';

  constructor() {  // Add entities parameter
    this.client = axios.create(API_CONFIG);
  }

  async getby(path: string, params?: Params): Promise<T | null> {

    const response: AxiosResponse<T> = await this.client.get<T>(path, { params });

    if (response.status !== 200) {
      console.error('GET request failed:', response.status, response.data);
      throw new Error('GET request failed');
    }

    return response.data;
  }

  private async page(config: AxiosRequestConfig): Promise<Page<T>> {

    try {
      const response: AxiosResponse<Page<T>> = await this.client.get<Page<T>>(this.path, config);

      if (response.status !== 200) {
        console.error('GET request failed:', response.status, response.data);
        throw new Error('GET request failed');
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response);
        if (error.response?.status == 429) {
          // Too many requests, wait and try again
          console.log("Too many requests, wait and try again");
          await new Promise(resolve => setTimeout(resolve, 5000));
          return this.page(config);
        }
        console.error(`AxiosError (${error.response?.status}) in fetchItems:`, error);
      }
      throw error;
    }
  }

  async next(cursor: string): Promise<Page<T>> {
    return this.page({ params: { cursor } });
  }


  async fetch(path: string, params: Params): Promise<Page<T>> {
    this.path = path;
    return this.page({ params });
  }

}


