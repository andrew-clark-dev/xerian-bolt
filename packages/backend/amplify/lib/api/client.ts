import { RestClient, IRequestOptions, IRestResponse } from 'typed-rest-client/RestClient';
import { Logger } from "@aws-lambda-powertools/logger";
const logger = new Logger({ serviceName: "api-clist", });

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

export interface ErrorWithCode {
  code: string;
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
      logger.error(`GET request failed: ${response.statusCode}`);
      throw new Error('GET request failed');
    }

    return response.result;
  }

  async list(params?: Params): Promise<T[]> {

    return (await this.fetch(params)).data;

  }



  private async page(path: string, params?: Params): Promise<Page<T>> {

    try {
      const response: IRestResponse<Page<T>> = await this.client.get<Page<T>>(path, this.requestOptions(params));

      if (response.statusCode == 429) {
        console.warn('Too many requests, wait and try again');
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.page(path, params);
      }

      if (response.statusCode !== 200) {
        console.error('GET request failed:', response.statusCode, response.result);
        throw new Error('GET request failed');
      }

      return response.result ?? { count: 0, data: [], next_cursor: null };
    } catch (error) {
      if ((error as { statusCode?: number }).statusCode == 429) {
        logger.warn(`Too Many Requeste - wait and retry.`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.page(path, params);
      } else {
        logger.error(`Error in fetch: ${error} - path : ${path} : params : ${JSON.stringify(params)}`);
        throw error;
      }

    }
  }

  async fetch(params?: Params): Promise<Page<T>> {
    return this.page(this.path, params);
  }
  async fetchForEntity(id: string, params?: Params): Promise<Page<T>> {
    const pathWithId = this.path.replace('{id}', id);
    logger.debug(`Fetching from : ${pathWithId}`);

    try {
      return this.page(pathWithId, params);
    } catch (error) {
      logger.error(`Could not access path : ${pathWithId}`);
      throw error;
    }
  }


  private requestOptions(params?: Params): IRequestOptions | undefined {
    return params ? { queryParameters: { params: params } } : undefined;
  }

}