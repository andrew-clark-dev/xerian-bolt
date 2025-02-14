import { generateClient } from 'aws-amplify/data';
import { v4 as uuidv4 } from 'uuid';
import type { Schema } from '../../amplify/data/resource';
import { currentUserId } from './profile.service';
import { checkedFutureResponse, checkedNotNullFutureResponse, checkedResponse } from './utils/error.utils';

const client = generateClient<Schema>();

export type Sale = Schema['Sale']['type'];
export type SaleCreate = Omit<Sale, 'id' | 'items' | 'createdAt' | 'updatedAt' | 'lastActivityBy'>;
export type SaleUpdate = Partial<Omit<Sale, 'number' | 'createdAt' | 'updatedAt' | 'lastActivityBy'>> & { number: string };
export type SaleStatus = Schema['Sale']['type']['status'];

interface ListSalesOptions {
  limit?: number;
  nextToken?: string | null;
  sort?: {
    field: keyof Sale;
    direction: 'asc' | 'desc';
  };
}

class SaleService {
  async findSale(number: string): Promise<Sale | null> {
    return await checkedFutureResponse(client.models.Sale.get({ number })) as Sale;
  }

  async getSale(number: string): Promise<Sale> {
    return await checkedNotNullFutureResponse(client.models.Sale.get({ number })) as Sale;
  }

  async createSale(sale: SaleCreate): Promise<Sale> {
    const response = await client.models.Sale.create({
      ...sale,
      id: uuidv4(),
      lastActivityBy: await currentUserId(),
      status: sale.status || 'Pending',
      tax: sale.tax || 0,
      change: sale.change || 0,
      refund: sale.refund || 0,
    });

    return checkedResponse(response) as Sale;
  }

  async updateSale(update: SaleUpdate): Promise<Sale> {
    const response = await client.models.Sale.update({
      ...update,
      lastActivityBy: await currentUserId()
    });

    return checkedResponse(response) as Sale;
  }

  async listSales(options: ListSalesOptions = {}): Promise<{ sales: Sale[]; nextToken: string | null }> {
    const response = await client.models.Sale.list({
      limit: options.limit || 10,
      nextToken: options.nextToken,
    });

    return { sales: checkedResponse(response) as Sale[], nextToken: response.nextToken ?? null };
  }
}

export const saleService = new SaleService();