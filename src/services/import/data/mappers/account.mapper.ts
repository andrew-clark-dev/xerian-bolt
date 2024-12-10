import type { Schema } from '../../../../../amplify/data/resource';
import type { ExternalAccount } from '../types';
import { isMobileNumber } from '../utils/phone.utils';

type Account = Schema['Account']['type'];

/**
 * Maps an external account to our internal Account type
 * @param external The external account data
 * @returns Mapped Account object
 */
export function mapExternalAccount(external: ExternalAccount): Omit<Account, 'id'> {
  const now = new Date().toISOString();

  // Map the external account to our internal format
  const mapped: Omit<Account, 'id'> = {
    number: external.number,
    firstName: external.first_name,
    lastName: external.last_name,
    email: external.email,
    phoneNumber: external.phone_number,
    isMobile: isMobileNumber(external.phone_number),
    addressLine1: external.address_line_1,
    addressLine2: external.address_line_2,
    city: external.city,
    state: external.state,
    postcode: external.postal_code,
    status: 'Active', // Default to Active since external doesn't have equivalent
    kind: 'Standard', // Default to Standard since external doesn't have equivalent
    defaultSplit: Math.round(external.default_split * 100), // Convert from decimal to integer percentage
    balance: external.balance,
    noSales: external.number_of_purchases,
    noItems: external.number_of_items,
    lastActivityAt: external.last_activity,
    lastItemAt: external.last_item_entered,
    lastSettlementAt: external.last_settlement,
    tags: external.tags,
    createdAt: external.created,
    updatedAt: now,
    deletedAt: external.deleted || undefined,
    comunicationPreferences: 'None', // Default to None since external doesn't specify
  };

  return mapped;
}

/**
 * Warnings about field mappings:
 * 
 * 1. Missing in our schema but present in external:
 * - company
 * - created_by
 * - custom_fields
 * - default_inventory_type
 * - default_terms
 * - email_notifications_enabled
 * - locations
 * - recurring_fees
 * - unpaid_balance_from
 * 
 * 2. Type conversions/assumptions:
 * - status: Defaulting to 'Active' since external doesn't have status
 * - kind: Defaulting to 'Standard' since external doesn't have account type
 * - defaultSplit: Converting from decimal (0.5) to percentage (50)
 * - isMobile: Determined by phone number pattern
 * - comunicationPreferences: Defaulting to 'None'
 * 
 * 3. Required fields in our schema that need attention:
 * - userId: Must be set after mapping
 */