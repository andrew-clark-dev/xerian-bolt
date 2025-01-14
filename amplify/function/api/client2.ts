import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from 'axios';

export const API_CONFIG: CreateAxiosDefaults = {
  baseURL: process.env.BASE_URL || '/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*', // Allow all origins
    'Authorization': 'Bearer ' + process.env.API_KEY,
  },
  withCredentials: true,
  timeout: 30000, // 30 second timeout
};

interface SearchResults<T> {
  results: {
    document: T;
    entity_type: string;
  }[];
}

export class SearchClient<T> {
  private client: AxiosInstance;
  private entities: 'items' | 'accounts';
  private url: string;
  constructor(entities: 'items' | 'accounts') {  // Add entities parameter
    this.entities = entities;
    this.client = axios.create(API_CONFIG);

    this.url = 'v1/search';
  }

  async get(config: AxiosRequestConfig): Promise<T[] | null> {

    const response: AxiosResponse<SearchResults<T>> = await this.client.get<SearchResults<T>>(this.url, config);

    if (response.status !== 200) {
      console.error('GET request failed:', response.status, response.data);
      throw new Error('GET request failed');
    }

    const result = response.data!.results.map((item) => {
      return item.document;
    });

    return result;
  }

  async search(query: string): Promise<T[] | null> {
    return this.get({
      params: { query: query, entities: [this.entities] }
    });
  }

}

export interface Page<T> {
  count: number | null;
  data: T[];
  next_cursor: string | null;
}

export interface Params {
  [name: string]: string | number | (string | number)[];
}

export class Client<T> {
  private client: AxiosInstance;
  private entities: 'items' | 'accounts';
  constructor(entities: 'items' | 'accounts') {  // Add entities parameter
    this.entities = entities;
    this.client = axios.create(API_CONFIG);
  }

  async getbyId(id: string, params?: Params): Promise<T | null> {

    const response: AxiosResponse<T> = await this.client.get<T>('v1/' + this.entities + '/' + id, { params });

    if (response.status !== 200) {
      console.error('GET request failed:', response.status, response.data);
      throw new Error('GET request failed');
    }

    return response.data;
  }

  async get(config: AxiosRequestConfig): Promise<T | null> {

    const response: AxiosResponse<T> = await this.client.get<T>('/v1/' + this.entities, config);

    if (response.status !== 200) {
      console.error('GET request failed:', response.status, response.data);
      throw new Error('GET request failed');
    }

    return response.data;
  }

  async page(config: AxiosRequestConfig): Promise<Page<T> | null> {

    try {
      const response: AxiosResponse<Page<T>> = await this.client.get<Page<T>>('v1/' + this.entities, config);

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

  async next(cursor: string): Promise<Page<T> | null> {
    return this.page({ params: { cursor } });
  }


  async fetch(params: Params): Promise<Page<T> | null> {
    return this.page({ params });
  }
}

