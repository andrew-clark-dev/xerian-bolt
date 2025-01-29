import { Schema } from "../../data/resource";
import { ApiClient } from "../api/client";
import { ExternalItem, importUserId } from "./item.external.sevice";

export type Transaction = Schema['Transaction']['type'];

export interface ExternalSale {
    channel: string,
    id: string,
    price_per: number,
    quantity: number,
    sold_at: string,
}

export const SALES_URL = 'v1/items/{id}/sales';

export const saleClient = new ApiClient<ExternalSale>(SALES_URL);

export const toTransaction = (exItem: ExternalItem, externalSale: ExternalSale): Transaction => {
    // Map external data to our Account type

    return {
        lastActivityBy: importUserId,
        type: 'Sale',
        paymentType: 'Other',
        channel: externalSale.channel,
        amount: externalSale.price_per * externalSale.quantity,
        time: externalSale.sold_at,
        itemSku: exItem.sku,
    } as Transaction;

}

export async function getSales(exItem: ExternalItem): Promise<Transaction[]> {
    const result: Transaction[] = [];
    if (exItem.status.sold > 0) {
        const { data } = await saleClient.fetch({ limit: 100 });
        if (data) {
            for (const sale of data) {
                result.push(toTransaction(exItem, sale));
            }
        }
    }
    return result;
}
