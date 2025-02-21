import { generateClient } from 'aws-amplify/data';
import { v4 as uuidv4 } from 'uuid';
import type { Schema } from '../../../backend/amplify/data/resource';
import { currentUserId } from './profile.service';
import { checkedFutureResponse, checkedResponse } from './utils/error.utils';

const client = generateClient<Schema>();

export type Sale = Schema['Sale']['type'];
export type SaleItem = Schema['SaleItem']['type'];
export type SaleCreate = Omit<Sale, 'id' | 'createdAt' | 'updatedAt' | 'lastActivityBy' | 'status'>;
export type SaleUpdate = Partial<Omit<Sale, 'number' | 'createdAt' | 'updatedAt' | 'lastActivityBy'>> & { number: string };
export type SaleStatus = Schema['Sale']['type']['status'];

export type Transaction = Schema['Transaction']['type'];



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
    const response = client.models.Sale.get({ number });
    const sale = await checkedFutureResponse(response) as Sale;
    return sale;

  }

  async getSale(number: string): Promise<Sale> {
    const sale = await this.findSale(number);
    if (!sale) {
      throw new Error('Sale not found');
    }
    return sale;
  }

  async createSale(sale: SaleCreate): Promise<Sale> {
    const response = await client.models.Sale.create({
      ...sale,
      id: uuidv4(),
      lastActivityBy: await currentUserId(),
      status: 'Pending',
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


  async getTransaction(sale: Sale): Promise<Transaction> {
    if (!sale.transaction) {
      throw new Error('Transaction not found');
    }
    const response = await client.models.Transaction.get({ id: sale.transaction });
    return checkedResponse(response) as Transaction;
  }
}

export const saleService = new SaleService();