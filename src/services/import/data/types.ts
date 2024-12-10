import type { Schema } from '../../../../amplify/data/resource';

export type UserRole = Schema['User']['type']['role'];
export type UserStatus = Schema['User']['type']['status'];

export interface ExternalUser {
  id: string;
  name: string;
  user_type: string;
}

/**
 * Represents a single account record from an external system
 */
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

/**
 * Represents a paginated response of external accounts
 */
export interface ExternalAccountPage {
  count: number;
  data: ExternalAccount[];
  next_cursor: string | null;
}