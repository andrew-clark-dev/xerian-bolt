import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './client2';

export const SEARCH_URL = 'v1/search';


interface SearchResults<T> {
    results: {
        document: T;
        entity_type: string;
    }[];
}



export class SearchClient<T> {
    private client: AxiosInstance;
    private entities: 'items' | 'accounts';
    constructor(entities: 'items' | 'accounts') {  // Add entities parameter
        this.entities = entities;
        this.client = axios.create(API_CONFIG);
    }

    async get(config: AxiosRequestConfig): Promise<T[] | null> {

        const response: AxiosResponse<SearchResults<T>> = await this.client.get<SearchResults<T>>(SEARCH_URL, config);

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