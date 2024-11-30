import { v4 as uuidv4 } from 'uuid';
import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';
import { AccountDAO, UserDAO } from './types';

// Generate the Amplify Data client
const client = generateClient<Schema>();

// Helper function to get current user ID
async function getCurrentUserId(): Promise<string> {
  try {
    const { userId } = await getCurrentUser();
    return userId;
  } catch (err) {
    throw new Error('User must be authenticated');
  }
}

// Repository interfaces
interface PaginationOptions<T> {
  page: number;
  pageSize: number;
  sortColumn?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Persistence service implementation
export const persistenceService = {
  // Account methods
  async createAccount(data: Omit<AccountDAO, 'id'>): Promise<AccountDAO> {
    const userId = await getCurrentUserId();
    return client.models.Account.create({
      ...data,
      id: uuidv4(),
      userId,
    });
  },

  async updateAccount(
    number: string,
    data: Partial<AccountDAO>
  ): Promise<AccountDAO | undefined> {
    await getCurrentUserId(); // Ensure user is authenticated
    const existing = await client.models.Account.list({
      filter: { number: { eq: number } },
      limit: 1,
    });

    if (!existing.data[0]) return undefined;

    return client.models.Account.update({
      ...existing.data[0],
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async getAccountByNumber(number: string): Promise<AccountDAO | undefined> {
    await getCurrentUserId(); // Ensure user is authenticated
    const result = await client.models.Account.list({
      filter: { number: { eq: number } },
      limit: 1,
    });
    return result.data[0];
  },

  async getAccounts(
    options: PaginationOptions<AccountDAO>
  ): Promise<PaginatedResult<AccountDAO>> {
    await getCurrentUserId(); // Ensure user is authenticated
    const result = await client.models.Account.list({
      page: options.page - 1,
      limit: options.pageSize,
      sort: options.sortColumn
        ? { field: options.sortColumn, direction: options.sortDirection }
        : undefined,
    });

    return {
      items: result.data,
      total: result.total,
      page: options.page,
      pageSize: options.pageSize,
      totalPages: Math.ceil(result.total / options.pageSize),
    };
  },

  async getNextAccountNumber(): Promise<string> {
    await getCurrentUserId(); // Ensure user is authenticated
    const result = await client.models.Account.list({
      page: 0,
      limit: 1,
      sort: { field: 'number', direction: 'desc' },
    });

    const lastNumber = result.data[0]?.number || 'ACC-00000';
    const numberPart = parseInt(lastNumber.split('-')[1], 10);
    return `ACC-${String(numberPart + 1).padStart(5, '0')}`;
  },

  // User methods
  async createUser(userDao: Omit<UserDAO, 'id'>): Promise<UserDAO> {
    await getCurrentUserId(); // Ensure user is authenticated
    return client.models.User.create(userDao);
  },

  async updateUser(
    email: string,
    data: Partial<UserDAO>
  ): Promise<UserDAO | undefined> {
    await getCurrentUserId(); // Ensure user is authenticated
    const existing = await client.models.User.list({
      filter: { email: { eq: email } },
      limit: 1,
    });

    if (!existing.data[0]) return undefined;

    return client.models.User.update({
      ...existing.data[0],
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async getUserByEmail(email: string): Promise<UserDAO | undefined> {
    await getCurrentUserId(); // Ensure user is authenticated
    const result = await client.models.User.list({
      filter: { email: { eq: email } },
      limit: 1,
    });
    return result.data[0];
  },

  async getUsers(
    options: PaginationOptions<UserDAO>
  ): Promise<PaginatedResult<UserDAO>> {
    await getCurrentUserId(); // Ensure user is authenticated
    const result = await client.models.User.list({
      page: options.page - 1,
      limit: options.pageSize,
      sort: options.sortColumn
        ? { field: options.sortColumn, direction: options.sortDirection }
        : undefined,
    });

    return {
      items: result.data,
      total: result.total,
      page: options.page,
      pageSize: options.pageSize,
      totalPages: Math.ceil(result.total / options.pageSize),
    };
  },

  async signUpUser(email: string, password: string): Promise<UserDAO | undefined> {
    await getCurrentUserId(); // Ensure user is authenticated
    const user = await this.getUserByEmail(email);
    if (!user) throw new Error('User not found');

    if (user.status !== 'Pending') {
      throw new Error('User is not in pending status');
    }

    // Update user status to active after successful signup
    return this.updateUser(email, { status: 'Active' });
  },
};