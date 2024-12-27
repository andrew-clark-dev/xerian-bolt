import type { Schema } from '../../../amplify/data/resource';

export type ModelType = keyof Schema;

export interface ImportProgress {
  processed: number;
  total: number;
  message: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  processed: number;
  failed: number;
  errors: Error[];
}

export interface ExternalUser {
  id: string;
  name: string;
  user_type: string;
}

export interface ExternalAccount {
  address_line_1: string;
  address_line_2: string;
  balance: number;
  city: string;
  company: string;
  created: string;
  created_by: ExternalUser;
  default_inventory_type: string;
  default_split: number;
  default_terms: string;
  deleted: string | null;
  email: string;
  email_notifications_enabled: boolean;
  first_name: string;
  id: string;
  last_activity: string;
  last_item_entered: string;
  last_name: string;
  last_settlement: string;
  locations: string[];
  number: string;
  number_of_items: number;
  number_of_purchases: number;
  phone_number: string;
  postal_code: string;
  recurring_fees: string[];
  state: string;
  tags: string[];
  unpaid_balance_from: number;
}

export interface ExternalAccountPage {
  count: number;
  data: ExternalAccount[];
  next_cursor: string | null;
}

export interface ExternalItem {
  account: string;
  brand: string;
  category: string;
  color: string;
  created: string;
  created_by: ExternalUser;
  days_on_shelf: number;
  deleted: string | null;
  description: string;
  details: boolean;
  expires: string;
  id: string;
  images: string[];
  inventory_type: string;
  last_sold: string;
  last_viewed: string;
  printed: string;
  schedule_start: string;
  size: string;
  sku: string;
  split: number;
  split_price: number;
  status: Map<string, number>;
  surcharges: string[];
  tag_price: string;
  recurring_fees: string[];
  state: string;
  tags: string[];
  terms: string;
  title: string;
}

export interface ExternalItemPage {
  count: number;
  data: ExternalItem[];
  next_cursor: string | null;
}

// Add date range type
export interface DateRange {
  from: Date;
  to: Date;
}