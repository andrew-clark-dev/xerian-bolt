import { API_CONFIG, PagedResponse, QueryParams } from './api';
import { HttpService } from './http.service';

export class AccountService {
    private http: HttpService;

    constructor(apiKey: string) {
        this.http = new HttpService(apiKey);
    }

    async getAccounts(params: QueryParams = {}): Promise<PagedResponse<CCAccount>> {
        return this.http.get<PagedResponse<CCAccount>>(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS}`,
            params
        );
    }

    async *accountGenerator(initialParams: QueryParams = {}) {
        let currentParams = { ...initialParams };

        while (true) {
            const response = await this.getAccounts(currentParams);

            yield response.data;

            if (!response.cursor) {
                break;
            }

            currentParams = {
                ...currentParams,
                cursor: response.cursor,
            };
        }
    }
}

export interface CCUser {
    id: string;
    name: string;
    user_type: string;
}

export interface CCAccount {
    id: string;
    address_line_1: string | null;
    address_line_2: string | null;
    balance: number;
    city: string | null;
    company: string | null;
    created: string;
    created_by: CCUser | null;
    default_inventory_type: string | null;
    default_split: number | null;
    default_terms: string | null;
    deleted: string | null;
    email: string | null;
    email_notifications_enabled: boolean | null;
    first_name: string | null;
    last_activity: string | null;
    last_item_entered: string | null;
    last_name: string | null;
    last_settlement: string | null;
    number: string;
    number_of_items: number | null;
    number_of_purchases: number | null;
    phone_number: string | null;
    postal_code: string | null;
    state: string | null;
    tags: string[] | null;
    unpaid_balance_from: number | null;
}