import { Schema } from "../../data/resource";
import { Client, SearchClient, Params } from "../api/client2";

export type Account = Schema['Account']['type'];

export interface ExternalAccount {
    id: string,
    number: string,
    last_activity?: string,
    last_item_entered?: string,
    last_settlement?: string,
    created: string,
    created_by: string,
    first_name: string | null,
    last_name: string | null,
    email: string | null,
    phone_number: string | null,
    address_line_1: string | null,
    address_line_2: string | null,
    city: string | null,
    state: string | null,
    postal_code: string | null,
    default_split?: number,
    balance: number,
    deleted?: string | null,
}

// export const accountParams: Params = {
//     include: ['default_split', 'last_settlement', 'number_of_purchases', 'created_by', 'last_activity', 'last_item_entered],
//     expand: ['created_by'],
//     sort_by: 'created'
// }

export const accountParams: Params = {
    include: ['created_by', 'last_activity', 'last_settlement', 'default_split', 'last_item_entered'],
}

export const accountClient = new Client<ExternalAccount>('accounts');

interface AccountSearchEntry {
    company: string | null;
    email: string | null;
    first_name: string | null;
    id: string;
    last_name: string | null;
    number: string;
    phone_number: string | null;
}

export const accountSearchClient = new SearchClient<AccountSearchEntry>('accounts');

export const toAccount = (externalAccount: ExternalAccount): Account => {
    // Map external data to our Account type
    return {
        number: externalAccount.number,
        lastActivityBy: externalAccount.created_by,
        lastActivityAt: externalAccount.last_activity || new Date().toISOString(),
        lastItemAt: externalAccount.last_item_entered,
        lastSettlementAt: externalAccount.last_settlement,
        firstName: externalAccount.first_name,
        lastName: externalAccount.last_name,
        email: externalAccount.email,
        phoneNumber: externalAccount.phone_number,
        addressLine1: externalAccount.address_line_1,
        addressLine2: externalAccount.address_line_2,
        city: externalAccount.city,
        state: externalAccount.state,
        postcode: externalAccount.postal_code,
        balance: externalAccount.balance,
        defaultSplit: externalAccount.default_split ? Math.round(externalAccount.default_split * 100) : 0,
        status: 'Active',
        kind: 'Standard',
        deletedAt: externalAccount.deleted || null,
        isMobile: isMobileNumber(externalAccount), // Will be calculated based on phone number
        comunicationPreferences: comunicationPreferences(externalAccount), // Default value
    } as Account;
}

/**
* Checks if an accoutn phone number indicates a mobile number based on Swiss mobile prefixes
* @param exAccount The account read from thee external system.
* @returns A boolean indicating if the number is a mobile number
*/
export async function findFirst(query: string): Promise<Account | null> {
    const accountSearchEntries = await accountSearchClient.search(query);

    if (!accountSearchEntries || accountSearchEntries.length === 0) {
        return null;
    }

    const exAccount = await accountClient.getbyId(accountSearchEntries[0].id, accountParams);

    if (!exAccount) {
        return null;
    }

    return toAccount(exAccount);

}


/**
* Checks if an accoutn phone number indicates a mobile number based on Swiss mobile prefixes
* @param exAccount The account read from thee external system.
* @returns A boolean indicating if the number is a mobile number
*/
export function isMobileNumber(exAccount: ExternalAccount): boolean {
    const mobileRegex = /078|076|079|(0).*78|(0).*76|(0).*79/gm;
    return mobileRegex.test(exAccount.phone_number ?? '');
}

/**
* Calculates the communication preferences based on the phone number and email address
* @param exAccount The account read from thee external system.
* @returns The communication preferences
*/
export function comunicationPreferences(exAccount: ExternalAccount): "TextMessage" | "Email" | "None" {
    if (isMobileNumber(exAccount)) {
        return "TextMessage";
    }
    if (exAccount.email) {
        return "Email";
    }
    return "None";
}