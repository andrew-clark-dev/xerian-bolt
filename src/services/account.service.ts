import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { currentUserId } from './profile.service';
import { checkedFutureResponse, checkedNotNullFutureResponse, checkedResponse } from './utils/error.utils';

const client = generateClient<Schema>();

export type Account = Schema['Account']['type'];
export type AccountUpdate = Partial<Omit<Account, 'number' | 'createdAt' | 'updatedAt' | 'lastActivityBy'>> & { number: string };
export type AccountCreate = Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'lastActivityBy'>;
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

  async findAccount(number: string): Promise<Account | null> {
    return await checkedFutureResponse(client.models.Account.get({ number })) as Account;
  }

  async getAccount(number: string): Promise<Account> {
    return await checkedNotNullFutureResponse(client.models.Account.get({ number })) as Account;
  }

  async createAccount(account: AccountCreate): Promise<Account> {
    const response = await client.models.Account.create({ ...account, lastActivityBy: await currentUserId() });

    return checkedResponse(response) as Account;
  }

  async updateAccount(update: AccountUpdate): Promise<Account> {

    const response = await client.models.Account.update({ ...update, lastActivityBy: await currentUserId() });

    return checkedResponse(response) as Account;
  }

  async listAccounts(options: ListAccountsOptions = {}): Promise<{ accounts: Account[]; nextToken: string | null }> {
    const response = await client.models.Account.list({
      limit: options.limit || 10,
      nextToken: options.nextToken,
    });

    return { accounts: checkedResponse(response) as Account[], nextToken: response.nextToken ?? null };
  }

  async findFirstExternalAccount(query: string): Promise<Account> {
    const response = await client.queries.findExternalAccount({ query: query });

    return checkedResponse(response) as Account;

  }

}

export const accountService = new AccountService();