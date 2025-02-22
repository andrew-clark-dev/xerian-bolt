import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../packages/backend/amplify/data/resource';
import { currentUserId } from './profile.service';
import { checkedFutureResponse, checkedNotNullFutureResponse, checkedResponse } from './utils/error.utils';
import { Item } from './item.service';

const client = generateClient<Schema>();

export type ItemCategory = Schema['ItemCategory']['type'];
export type ItemCategoryKind = Schema['ItemCategoryKind']['type'];


interface ListItemCategorysOptions {
  limit?: number;
  nextToken?: string | null;
  sort?: {
    field: keyof ItemCategory;
    direction: 'asc' | 'desc';
  };
}

class ItemCategoryService {

  async findItemCategory(kind: ItemCategoryKind, name: string): Promise<ItemCategory | null> {
    return await checkedFutureResponse(client.models.ItemCategory.get({ kind, name })) as ItemCategory;
  }

  async getItemCategory(kind: ItemCategoryKind, name: string): Promise<ItemCategory> {
    return await checkedNotNullFutureResponse(client.models.ItemCategory.get({ kind, name })) as ItemCategory;
  }

  async mergeItemCategory(kind: ItemCategoryKind, name: string, obsoletName: string, addMAtch: boolean = true): Promise<ItemCategory> {

    const toUpdateCategory = await this.getItemCategory(kind, name);

    const response = (kind: ItemCategoryKind) =>
      kind === 'Category' ? client.models.Item.listItemByCategory({ category: obsoletName }) :
        kind === 'Brand' ? client.models.Item.listItemByBrand({ brand: obsoletName }) :
          kind === 'Color' ? client.models.Item.listItemByColor({ color: obsoletName }) :
            kind === 'Size' ? client.models.Item.listItemBySize({ size: obsoletName }) : null;

    const items = await checkedFutureResponse(response(kind)) as Item[];

    items.forEach(async item => {
      await client.models.Item.update({ sku: item.sku, [kind.toLowerCase()]: name });
    }
    );

    if (addMAtch) {
      const matchNames = toUpdateCategory.matchNames + ' ' + obsoletName;
      const response = await client.models.ItemCategory.update({ kind, name, matchNames, lastActivityBy: await currentUserId() });
      return checkedResponse(response) as ItemCategory;
    } else {
      return toUpdateCategory;
    }
  }

  async createItemCategory(category: ItemCategory): Promise<ItemCategory> {
    const response = await client.models.ItemCategory.create({ ...category, lastActivityBy: await currentUserId() });
    return checkedResponse(response) as ItemCategory;
  }

  async updateItemCategory(update: ItemCategory): Promise<ItemCategory> {
    const response = await client.models.ItemCategory.update({ ...update, kind: update.kind!, lastActivityBy: await currentUserId() });
    return checkedResponse(response) as ItemCategory;
  }

  async listItemCategorys(options: ListItemCategorysOptions = {}): Promise<{ accounts: ItemCategory[]; nextToken: string | null }> {
    const response = await client.models.ItemCategory.list({
      limit: options.limit || 10,
      nextToken: options.nextToken,
    });

    return { accounts: checkedResponse(response) as ItemCategory[], nextToken: response.nextToken ?? null };
  }

}

export const categoryService = new ItemCategoryService();