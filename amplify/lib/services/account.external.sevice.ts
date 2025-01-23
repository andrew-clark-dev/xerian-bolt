import { Schema } from "../../data/resource";
import { Client, Params } from "../api/client2";
import { ExternalUser } from "./user.external.sevice";

export type Account = Schema['Account']['type'];

export interface ExternalAccount {
    id: string,
    number: string,
    last_activity?: string,
    last_item_entered?: string,
    last_settlement?: string,
    created: string,
    created_by: ExternalUser,
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

export const accountParams: Params = {
    include: ['created_by', 'last_activity', 'last_settlement', 'default_split', 'last_item_entered'],
    expand: ['created_by'],
    sort_by: 'created',
}

export const accountClient = new Client<ExternalAccount>('accounts');

export const toAccount = (externalAccount: ExternalAccount): Account => {
    // Map external data to our Account type
    const created_by_id = typeof externalAccount.created_by === "string" ? externalAccount.created_by : externalAccount.created_by.id;

    return {
        number: externalAccount.number,
        lastActivityBy: created_by_id,
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

export async function findFirstAccount(query: string): Promise<Account | null> {
    const { data } = await accountClient.fetch({ ...accountParams, search: query });

    if (data.length === 0) { return null; }

    return toAccount(data[0]);

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