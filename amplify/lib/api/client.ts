import { RestClient, IRequestOptions, IRestResponse } from 'typed-rest-client/RestClient';

export const BASE_URL = process.env.BASE_URL || '/api';

export interface Params {
  [name: string]: string | number | (string | number)[];
}

export interface Page<T> {
  count: number | null;
  data: T[];
  next_cursor: string | null;
}

export interface SearchResults<T> {
  results: {
    document: T;
    entity_type: string;
  }[];
}

export class ApiClient<T> {
  private client: RestClient;
  private path: string;
  constructor(path: string) {  // root path of the entity
    this.path = path;
    this.client = new RestClient('cc-client', BASE_URL, [], {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins
        'Authorization': 'Bearer ' + process.env.API_KEY, // API_KEY is a secret
      }
    });

  }

  async get(id: string, params?: Params): Promise<T | null> {

    const getPath = id ? this.path + '/' + id : this.path;
    const options: IRequestOptions = params ? { queryParameters: { params } } : {};

    const response: IRestResponse<T> = await this.client.get<T>(getPath, options);

    if (response.statusCode !== 200) {
      console.error('GET request failed:', response.statusCode, response.result);
      throw new Error('GET request failed');
    }

    return response.result;
  }

  async list(params?: Params): Promise<T[]> {

    return (await this.fetch(params)).data;

  }

  private async page(path: string, params?: Params): Promise<Page<T>> {

    const response: IRestResponse<Page<T>> = await this.client.get<Page<T>>(path, this.requestOptions(params));

    if (response.statusCode !== 200) {
      console.error('GET request failed:', response.statusCode, response.result);
      throw new Error('GET request failed');
    }

    return response.result ?? { count: 0, data: [], next_cursor: null };
  }

  async fetch(params?: Params): Promise<Page<T>> {
    return this.page(this.path, params);
  }

  async next(cursor: string): Promise<Page<T>> {
    return this.page(this.path, { cursor: cursor });
  }

  private requestOptions(params?: Params): IRequestOptions | undefined {
    return params ? { queryParameters: { params: params } } : undefined;
  }

}