import { Schema } from "../../data/resource";
import { Client, SearchClient, Params } from "../api/client2";

export type Item = Schema['Item']['type'];
export type ItemStatus = Schema['Item']['type']['status'];

export interface ExternalItemStatus {
    active: number,
    damaged: number,
    donated: number,
    lost: number,
    parked: number,
    returned_to_owner: number,
    sold: number,
    sold_on_legacy: number,
    sold_on_shopify: number,
    sold_on_square: number,
    sold_on_third_party: number,
    stolen: number,
    to_be_returned: number,
}

export interface ExternalItem {

    account: {
        id: string,
        number: string,
    } | null,
    brand: string | null,
    category: {
        id: string,
        name: string,
    } | null,
    color: string | null,
    cost_per: number | null,
    created: string,
    created_by: {
        id: string,
        name: string,
        user_type: string,
    } | string,
    days_on_shelf?: number,
    deleted: string | null,
    description: string | null,
    details: string | null,
    id: string,
    inventory_type: string,
    last_sold?: string | null,
    last_viewed?: string | null,
    printed?: string | null,
    quantity?: number | null,
    shelf: string | null,
    shopify_product_id: string | null,
    size: string | null,
    sku: string,
    split: number | null,
    split_price: number | null,
    status: ExternalItemStatus,
    tag_price: number | null,
    tax_exempt?: boolean,
    terms: string | null,
    title: string | null,

}

export const itemFetchParams: Params = {
    include: ['created_by', 'days_on_shelf', 'last_sold', 'last_viewed', 'printed', 'split_price', 'tax_exempt', 'quantity'],
    expand: ['created_by', 'category', 'account'],
    sort_by: 'created',
    cursor: null
}

export const itemGetParams: Params = {
    include: ['printed', 'split_price', 'quantity'],
    expand: ['category', 'account'],
}

export const itemClient = new Client<ExternalItem>('items');

interface ItemSearchEntry {
    brand: string | null,
    color: string | null,
    created: string,
    description: string | null,
    id: string,
    size: string | null,
    sku: string,
    tag_price: number | null,
    title: string | null
}

export const itemSearchClient = new SearchClient<ItemSearchEntry>('items');

export const toItem = (externalItem: ExternalItem): Item => {
    // Map external data to our Item type
    const created_by_id = typeof externalItem.created_by === "string" ? externalItem.created_by : externalItem.created_by.id;

    return {
        id: externalItem.id,
        sku: externalItem.sku,
        lastActivityBy: created_by_id,
        title: externalItem.title,
        accountNumber: externalItem.account?.number,
        category: externalItem.category?.name,
        brand: externalItem.brand,
        color: externalItem.color,
        size: externalItem.size,
        description: externalItem.description,
        details: externalItem.details,
        condition: 'NotSpecified',
        quantity: externalItem.quantity,
        split: externalItem.split,
        price: externalItem.tag_price,
        status: toStatus(externalItem),
        statuses: toStatuses(externalItem),
        printedAt: externalItem.printed,
        lastSoldAt: externalItem.last_sold,
        lastViewedAt: externalItem.last_viewed,
        createdAt: externalItem.created,
        deletedAt: externalItem.deleted,
    } as Item;
}

/**
* Checks if an accoutn phone number indicates a mobile number based on Swiss mobile prefixes
* @param exItem The account read from thee external system.
* @returns A boolean indicating if the number is a mobile number
*/
export async function findFirst(query: string): Promise<Item | null> {
    const itemSearchEntries = await itemSearchClient.search(query);

    if (!itemSearchEntries || itemSearchEntries.length === 0) {
        return null;
    }

    const exItem = await itemClient.getbyId(itemSearchEntries[0].id, itemGetParams);

    if (!exItem) {
        return null;
    }

    return toItem(exItem);

}


export function toStatus(exItem: ExternalItem): ItemStatus {
    if (exItem.quantity ?? 1 > 1) return 'Multi'
    if (exItem.status.sold > 0) return 'Sold'
    if (exItem.status.active > 0) return 'Active'
    if (exItem.status.donated > 0) return 'Donated'
    if (exItem.status.lost > 0) return 'Lost'
    if (exItem.status.parked > 0) return 'Parked'
    if (exItem.status.sold_on_shopify > 0) return 'Sold'
    if (exItem.status.stolen > 0) return 'Stolen'
    return 'Unknown'
}

export function toStatuses(exItem: ExternalItem): ItemStatus[] | null {
    if (exItem.quantity ?? 1 == 1) { return null }

    const statuses: ItemStatus[] = [];
    for (let i = 0; i < exItem.status.active; i++) { statuses.push('Active') }
    for (let i = 0; i < exItem.status.damaged; i++) { statuses.push('Unknown') }
    for (let i = 0; i < exItem.status.donated; i++) { statuses.push('Donated') }
    for (let i = 0; i < exItem.status.parked; i++) { statuses.push('Parked') }
    for (let i = 0; i < exItem.status.sold; i++) { statuses.push('Sold') }
    for (let i = 0; i < exItem.status.sold_on_shopify; i++) { statuses.push('Sold') }
    for (let i = 0; i < exItem.status.stolen; i++) { statuses.push('Stolen') }
    return statuses;
}
