import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { currentUserId } from './profile.service';
import { checkedFutureResponse, checkedNotNullFutureResponse, checkedResponse } from './utils/error.utils';

const client = generateClient<Schema>();

export type Item = Schema['Item']['type'];
export type ItemUpdate = Partial<Omit<Item, 'sku' | 'createdAt' | 'updatedAt' | 'lastActivityBy'>> & { sku: string };
export type ItemCreate = Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'lastActivityBy'>;
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

  async createItem(account: ItemCreate): Promise<Item> {
    const response = await client.models.Item.create({ ...account, lastActivityBy: await currentUserId() });

    return checkedResponse(response) as Item;
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

  // async findFirstExternalItem(query: string): Promise<Item> {
  //   const response = await client.queries.findExternalItem({ query: query });

  //   return checkedResponse(response) as Item;

  // }

}

export const itemService = new ItemService();