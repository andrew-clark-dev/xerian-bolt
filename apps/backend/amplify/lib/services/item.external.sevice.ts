import { SaleItem } from "../../data/import/handler.sale";
import { Schema } from "../../data/resource";
import { ApiClient, Params, Page } from "../api/client";
import { ExternalUser } from "./user.external.sevice";


export type Item = Schema['Item']['type'];
export type ItemStatus = Schema['Item']['type']['status'];
export type ItemGroup = Schema['ItemGroup']['type'];
export type ItemCategory = Schema['ItemCategory']['type'];


export const ITEM_URL = 'v1/items';

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
    created_by: ExternalUser,
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

export const toItem = (externalItem: ExternalItem): Item => {
    // Map external data to our Item type
    const created_by_id = typeof externalItem.created_by === "string" ? externalItem.created_by : externalItem.created_by.id;

    return {
        id: externalItem.id,
        sku: externalItem.sku,
        lastActivityBy: created_by_id,
        title: externalItem.title,
        accountNumber: externalItem.account?.number,
        category: externalItem.category?.name ?? 'NotSpecified',
        brand: externalItem.brand ?? 'NotSpecified',
        color: externalItem.color ?? 'NotSpecified',
        size: externalItem.size ?? 'NotSpecified',
        description: externalItem.description,
        details: externalItem.details,
        condition: 'NotSpecified',
        split: Math.trunc((externalItem.split ?? 0) * 100),
        price: externalItem.tag_price,
        status: toStatus(externalItem),
        //        group: toGroup(externalItem),
        printedAt: externalItem.printed,
        lastSoldAt: externalItem.last_sold,
        lastViewedAt: externalItem.last_viewed,
        createdAt: externalItem.created,
        deletedAt: externalItem.deleted,
    } as Item;
}


export const toSaleItem = (item: Item): SaleItem => {
    // Map item to sale item 
    return {
        sku: item.sku,
        title: item.title,
        category: item.category ?? 'NotSpecified',
        brand: item.brand ?? 'NotSpecified',
        color: item.color ?? 'NotSpecified',
        size: item.size ?? 'NotSpecified',
        description: item.description,
        details: item.details,
        condition: 'NotSpecified',
        split: Math.trunc((item.split ?? 0) * 100),
        price: item.price,
    } as SaleItem;
}

export const toCategories = (item: Item): { category: ItemCategory, brand: ItemCategory, color: ItemCategory, size: ItemCategory } => {
    return {
        category: { name: item.category, lastActivityBy: item.lastActivityBy, kind: 'category', matchNames: item.category } as ItemCategory,
        brand: { name: item.brand, lastActivityBy: item.lastActivityBy, kind: 'brand', matchNames: item.brand } as ItemCategory,
        color: { name: item.color, lastActivityBy: item.lastActivityBy, kind: 'color', matchNames: item.color } as ItemCategory,
        size: { name: item.size, lastActivityBy: item.lastActivityBy, kind: 'size', matchNames: item.size } as ItemCategory,
    } as const;

}

export const itemParams: Params = {
    include: ['created_by', 'days_on_shelf', 'last_sold', 'last_viewed', 'printed', 'split_price', 'tax_exempt', 'quantity'],
    expand: ['created_by', 'category', 'account'],
    sort_by: 'created',
}

export const itemClient = new ApiClient<ExternalItem>(ITEM_URL);

export async function findFirst(query: string): Promise<Item | null> {
    const { data } = await itemClient.fetch({ ...itemParams, ...{ search: query } });

    if (data.length === 0) { return null; }

    return toItem(data[0]);

}

export async function paged(cursor?: string | null, from?: string): Promise<Page<ExternalItem>> {
    let params = cursor ? { ...itemParams, ...{ cursor: cursor } } : itemParams;
    params = from ? { ...params, ...{ 'created:gte': from } } : params;
    return itemClient.fetch(params);
}

export function toStatus(exItem: ExternalItem): ItemStatus {
    if (toSales(exItem) > 0) return 'Sold'
    if (exItem.status.active > 0) return 'Active'
    if (exItem.status.donated > 0) return 'Donated'
    if (exItem.status.lost > 0) return 'Lost'
    if (exItem.status.parked > 0) return 'Parked'
    if (exItem.status.stolen > 0) return 'Stolen'
    return 'Unknown'
}

export function toSales(exItem: ExternalItem): number {
    return (exItem.status.sold || 0) + (exItem.status.sold_on_shopify || 0) + (exItem.status.sold_on_square || 0) + (exItem.status.sold_on_third_party || 0) + (exItem.status.sold_on_legacy || 0);
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

export function toGroup(exItem: ExternalItem): ItemGroup {
    return {
        quantity: exItem.quantity!,
        statuses: toStatuses(exItem),
        itemSku: exItem.sku,
    } as ItemGroup;
}