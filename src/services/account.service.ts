import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { profileService } from './profile.service';

const client = generateClient<Schema>();

export type Account = Schema['Account']['type'];
export type AccountDTO = Partial<Omit<Account, 'id'>>;
export type AccountStatus = Schema['Account']['type']['status'];



interface ListAccountsOptions {
  limit?: number;
  nextToken?: string | null;
  sort?: {
    field: keyof Account;
    direction: 'asc' | 'desc';
  };
}

class AccountService {
  private serviceError(error: unknown, context: string): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    return new Error(`${context}: ${message}`);
  }

  async findAccount(number: string): Promise<Account | null> {
    try {
      const { data: account, errors } = await client.models.Account.get({ number: number });

      if (errors) {
        throw this.serviceError(errors, 'findAccount');
      }

      return account;
    } catch (error) {
      throw this.serviceError(error, 'findAccount');
    }
  }

  async getAccount(number: string): Promise<Account> {
    const account = await this.findAccount(number);
    if (!account) {
      throw new Error('Account not found');
    }
    return account;
  }


  async createAccount(account: AccountDTO): Promise<Account> {
    try {
      const { data: newAccount, errors } = await client.models.Account.create({
        number: account.number!,
        lastActivityBy: (await profileService.getCurrentUserProfile()).id,
        status: account.status,
      });

      if (errors) {
        throw this.serviceError(errors, 'createAccount');
      }

      return newAccount!;
    } catch (error) {
      throw this.serviceError(error, 'createAccount');
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
        throw this.serviceError(errors, 'updateAccount');
      }

      return account!;
    } catch (error) {
      throw this.serviceError(error, 'updateAccount');
    }
  }

  async listAccounts(options: ListAccountsOptions = {}): Promise<{ accounts: Account[]; nextToken: string | null }> {
    try {
      const {
        data: accounts,
        nextToken,
        errors
      } = await client.models.Account.list({
        limit: options.limit || 10,
        nextToken: options.nextToken,
      });

      if (errors) {
        throw this.serviceError(errors, 'listAccounts');
      }

      return { accounts: accounts as Account[], nextToken: nextToken ?? null };
    } catch (error) {
      throw this.serviceError(error, 'listAccounts');
    }
  }
}

export const accountService = new AccountService();