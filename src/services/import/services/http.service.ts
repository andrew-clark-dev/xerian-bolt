import { ApiError } from './api';

export class HttpService {
    constructor(private apiKey: string) { }

    private getHeaders(): Headers {
        return new Headers({
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        });
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new ApiError(
                response.status,
                error.message || 'An error occurred',
                error
            );
        }
        return response.json();
    }

    async get<T>(url: string, params?: Record<string, any>): Promise<T> {
        const queryString = params
            ? '?' + new URLSearchParams(
                Object.entries(params)
                    .filter(([_, value]) => value != null)
                    .reduce((acc, [key, value]) => ({
                        ...acc,
                        [key]: Array.isArray(value) ? value.join(',') : value,
                    }), {})
            ).toString()
            : '';

        const response = await fetch(`${url}${queryString}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        return this.handleResponse<T>(response);
    }
}