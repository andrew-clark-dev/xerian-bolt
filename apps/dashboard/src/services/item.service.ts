import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../packages/backend/amplify/data/resource';
import { currentUserId } from './profile.service';
import { checkedFutureResponse, checkedNotNullFutureResponse, checkedResponse } from './utils/error.utils';
import { Sale, saleService } from './sale.service';

const client = generateClient<Schema>();

export type Item = Schema['Item']['type'];
export type SaleItem = Schema['SaleItem']['type'];
export type ItemCreate = Omit<Item, 'id' | 'transactions' | 'account' | 'createdAt' | 'updatedAt' | 'lastActivityBy'> & { quantity: number };
export type ItemUpdate = Partial<Omit<ItemCreate, 'sku'>> & { sku: string };
export type ItemStatus = Schema['Item']['type']['status'];

interface ListItemsOptions {
  limit?: number;
  nextToken?: string | null;
  sort?: {
    field: keyof Item;
    direction: 'asc' | 'desc';
  };
}

class ItemService {

  async findItem(sku: string): Promise<Item | null> {
    return await checkedFutureResponse(client.models.Item.get({ sku })) as Item;
  }

  async getItem(sku: string): Promise<Item> {
    return await checkedNotNullFutureResponse(client.models.Item.get({ sku })) as Item;
  }

  async createItem(item: ItemCreate): Promise<Item> {
    const response = await client.models.Item.create({ ...item, lastActivityBy: await currentUserId() });
    const newItem = checkedResponse(response) as Item;
    if (item.quantity > 0) {
      await client.models.ItemGroup.create({
        itemSku: newItem.sku,
        quantity: item.quantity,
        statuses: Array(item.quantity).fill(newItem.status)
      });
    }

    return newItem;
  }

  async updateItem(update: ItemUpdate): Promise<Item> {
    const response = await client.models.Item.update({ ...update, lastActivityBy: await currentUserId() });
    return checkedResponse(response) as Item;
  }

  async listItems(options: ListItemsOptions = {}): Promise<{ accounts: Item[]; nextToken: string | null }> {
    const response = await client.models.Item.list({
      limit: options.limit || 10,
      nextToken: options.nextToken,
    });

    return { accounts: checkedResponse(response) as Item[], nextToken: response.nextToken ?? null };
  }

  async findFirstExternalItem(query: string): Promise<Item | null> {
    const response = await client.queries.findExternalItem({ query });
    return checkedResponse(response) as Item;
  }

  async getSales(item: Item): Promise<Sale[]> {
    try {

      if (!item.sales || item.sales.length === 0) {
        return [];
      }

      // Fetch all sales in parallel using Promise.all
      const salesPromises = item.sales.map(saleNumber =>
        saleService.findSale(saleNumber!)
      );

      // Wait for all sales to be fetched and filter out any null results
      const sales = (await Promise.all(salesPromises)).filter((sale): sale is Sale => sale !== null);

      // Sort sales by date (newest first)
      return sales.sort((a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
    } catch (error) {
      console.error('Failed to get sales for item:', error);
      throw new Error(`Failed to get sales for item ${item.sku}`);
    }
  }
}

export const itemService = new ItemService();