export interface Account {
  id: string;
  number: string;
  default_split?: number;
  last_settlement?: string;
  number_of_purchases?: number;
  default_inventory_type?: string;
  default_terms?: string;
  last_item_entered?: string;
  number_of_items?: number;
  created_by?: User;
  last_activity?: string;
  locations?: Location[];
  recurring_fees?: RecurringFee[];
  tags?: string[];
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface RecurringFee {
  id: string;
  amount: number;
  frequency: string;
}

export interface AccountsResponse {
  data: Account[];
  next_cursor?: string;
  total: number;
}