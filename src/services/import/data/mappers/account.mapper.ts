import { AccountCreate } from '../../../account.service';
import type { ExternalAccount } from '../../types';
import { isMobileNumber } from '../utils/phone.utils';

export function mapExternalAccount(external: ExternalAccount): AccountCreate {

  return {
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
    status: 'Active',
    kind: 'Standard',
    defaultSplit: Math.round(external.default_split * 100),
    balance: external.balance,
    noSales: external.number_of_purchases,
    noItems: external.number_of_items,
    lastActivityAt: external.last_activity,
    lastItemAt: external.last_item_entered,
    lastSettlementAt: external.last_settlement,
    tags: external.tags,
    createdAt: external.created,
    deletedAt: external.deleted || undefined,
    comunicationPreferences: comunicationPreferences(external.phone_number, external.email),
  };
}

function comunicationPreferences(phone_number: string, email: string): "TextMessage" | "Email" | "Whatsapp" | "None" {
  if (phone_number && isMobileNumber(phone_number)) {
    return "TextMessage";
  } else if (email) {
    return "Email";
  } else {
    return "None";
  }
}