import { RestClient, IRequestOptions, IRestResponse } from 'typed-rest-client/RestClient';


interface SearchResults<T> {
  results: {
    document: T;
    entity_type: string;
  }[];
}

export class SearchClient<T> {
  private client: RestClient;
  private entities: 'items' | 'accounts';
  constructor(entities: 'items' | 'accounts') {  // Add entities parameter
    this.entities = entities;
    this.client = new RestClient('search-client', 'https://api.consigncloud.com/api/', [], {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YWI3YWViMGItYWIwMS00YTcyLWI0ODktYzZhYzdhYTEyMTlmOnZsN0UybnZpaTdPYldIb0QwdFF5bVE='
      }
    });

  }

  async get(options: IRequestOptions): Promise<T[] | null> {

    const response: IRestResponse<SearchResults<T>> = await this.client.get<SearchResults<T>>('v1/search', options);

    if (response.statusCode !== 200) {
      console.error('GET request failed:', response.statusCode, response.result);
      throw new Error('GET request failed');
    }

    const result = response.result!.results.map((result) => {
      return result.document;
    });

    return result;
  }

  async search(query: string): Promise<T[] | null> {
    return this.get({ queryParameters: { params: { query, entities: [this.entities] } } });
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
  private client: RestClient;
  private entities: 'items' | 'accounts';
  constructor(entities: 'items' | 'accounts') {  // Add entities parameter
    this.entities = entities;
    this.client = new RestClient('import-' + entities + '-client', 'https://api.consigncloud.com/api');
  }

  async getbyId(id: string): Promise<T | null> {

    const response: IRestResponse<T> = await this.client.get<T>('/v1/' + this.entities + '/' + id);

    if (response.statusCode !== 200) {
      console.error('GET request failed:', response.statusCode, response.result);
      throw new Error('GET request failed');
    }

    return response.result;
  }

  async get(options: IRequestOptions): Promise<T | null> {

    const response: IRestResponse<T> = await this.client.get<T>('/v1/' + this.entities, options);

    if (response.statusCode !== 200) {
      console.error('GET request failed:', response.statusCode, response.result);
      throw new Error('GET request failed');
    }

    return response.result;
  }

  async page(options: IRequestOptions): Promise<Page<T> | null> {

    const response: IRestResponse<Page<T>> = await this.client.get<Page<T>>('/v1/' + this.entities, options);

    if (response.statusCode !== 200) {
      console.error('GET request failed:', response.statusCode, response.result);
      throw new Error('GET request failed');
    }

    return response.result;
  }
  async next(cursor: string): Promise<Page<T> | null> {
    return this.page({ queryParameters: { params: { cursor } } });
  }


  async fetch(params: Params): Promise<Page<T> | null> {
    return this.page({ queryParameters: { params } });
  }
}

