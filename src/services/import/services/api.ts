export const API_CONFIG = {
    BASE_URL: 'https://api.consigncloud.com/api/v1',
    ENDPOINTS: {
        ACCOUNTS: '/accounts',
    },
} as const;

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export interface PagedResponse<T> {
    data: T[];
    total: number;
    cursor: string | null;
}

export interface QueryParams {
    sort_by?: string;
    cursor?: string | null;
    include?: string[];
    expand?: string[];
}