import axios from 'axios';
import { API_CONFIG } from './config';
import type { AccountsResponse } from './consign_cloud/types';

interface FetchAccountsOptions {
  cursor?: string | null;
  to?: Date | null;
  apiKey: string;
}

export async function fetchAccounts({
  cursor = null,
  to = null,
  apiKey,
}: FetchAccountsOptions): Promise<AccountsResponse> {
  const queryParameters = new URLSearchParams({
    sort_by: 'created',
    include: [
      'default_split',
      'last_settlement',
      'number_of_purchases',
      'default_inventory_type',
      'default_terms',
      'last_item_entered',
      'number_of_items',
      'created_by',
      'last_activity',
      'locations',
      'recurring_fees',
      'tags',
    ].join(','),
    expand: ['created_by', 'locations', 'recurring_fees'].join(','),
  });

  if (cursor) {
    queryParameters.append('cursor', cursor);
  }

  if (to) {
    queryParameters.append('created:lte', `${to.toISOString()}Z`);
  }

  const url = new URL(
    `/api/${API_CONFIG.version}/accounts`,
    API_CONFIG.baseUrl
  );
  url.search = queryParameters.toString();

  try {
    const response = await axios.get<AccountsResponse>(url.toString(), {
      headers: {
        ...API_CONFIG.defaultHeaders,
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
}