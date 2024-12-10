import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export type Account = Schema['Account']['type'];

class AccountService {
  private async handleServiceError(error: unknown, context: string): never {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    throw new Error(`${context}: ${message}`);
  }

  async findAccount(accountId: string): Promise<Account | null> {
    try {
      const { data: account, errors } = await client.models.Account.get({ id: accountId });
      
      if (errors) {
        this.handleServiceError(errors, 'findAccount');
      }
      
      return account;
    } catch (error) {
      this.handleServiceError(error, 'findAccount');
    }
  }

  async getAccount(accountId: string): Promise<Account> {
    const account = await this.findAccount(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    return account;
  }

  async findAccountByNumber(accountNumber: string): Promise<Account | null> {
    try {
      const { data: accounts, errors } = await client.models.Account.list({
        filter: { number: { eq: accountNumber } },
        limit: 1,
      });

      if (errors) {
        this.handleServiceError(errors, 'findAccountByNumber');
      }

      return accounts[0] || null;
    } catch (error) {
      this.handleServiceError(error, 'findAccountByNumber');
    }
  }

  async createAccount(account: Omit<Account, 'id'>): Promise<Account> {
    try {
      const now = new Date().toISOString();
      const { data: newAccount, errors } = await client.models.Account.create({
        ...account,
        createdAt: now,
        updatedAt: now,
        lastActivityAt: now,
        balance: account.balance ?? 0,
        noSales: account.noSales ?? 0,
        noItems: account.noItems ?? 0,
      });

      if (errors) {
        this.handleServiceError(errors, 'createAccount');
      }

      return newAccount!;
    } catch (error) {
      this.handleServiceError(error, 'createAccount');
    }
  }

  async updateAccount(accountId: string, updates: Partial<Account>): Promise<Account> {
    try {
      const existingAccount = await this.getAccount(accountId);

      const { data: account, errors } = await client.models.Account.update({
        ...existingAccount,
        ...updates,
        id: accountId,
        updatedAt: new Date().toISOString(),
      });

      if (errors) {
        this.handleServiceError(errors, 'updateAccount');
      }

      return account!;
    } catch (error) {
      this.handleServiceError(error, 'updateAccount');
    }
  }

  async deleteAccount(accountId: string): Promise<void> {
    try {
      const { errors } = await client.models.Account.delete({ id: accountId });
      
      if (errors) {
        this.handleServiceError(errors, 'deleteAccount');
      }
    } catch (error) {
      this.handleServiceError(error, 'deleteAccount');
    }
  }

  async listAccounts(options: {
    limit?: number;
    nextToken?: string;
    filter?: Record<string, any>;
    sort?: {
      field: keyof Account;
      direction: 'asc' | 'desc';
    };
  } = {}): Promise<{
    accounts: Account[];
    nextToken?: string;
  }> {
    try {
      const { data: accounts, errors, nextToken } = await client.models.Account.list({
        limit: options.limit,
        nextToken: options.nextToken,
        filter: options.filter,
        sort: options.sort,
      });

      if (errors) {
        this.handleServiceError(errors, 'listAccounts');
      }

      return { accounts, nextToken };
    } catch (error) {
      this.handleServiceError(error, 'listAccounts');
    }
  }

  async getNextAccountNumber(): Promise<string> {
    try {
      const { accounts } = await this.listAccounts({
        limit: 1,
        sort: {
          field: 'number',
          direction: 'desc',
        },
      });

      const lastNumber = accounts[0]?.number || 'ACC-00000';
      const numberPart = parseInt(lastNumber.split('-')[1], 10);
      return `ACC-${String(numberPart + 1).padStart(5, '0')}`;
    } catch (error) {
      this.handleServiceError(error, 'getNextAccountNumber');
    }
  }
}

export const accountService = new AccountService();