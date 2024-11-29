import { v4 as uuidv4 } from 'uuid';
import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

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

// Use Schema types for our DAOs
type AccountDAO = Schema['Account']['type'];
type UserDAO = Schema['User']['type'];

// Data Transfer Objects (DTOs)
interface AccountDTO {
  id: string;
  number: string;
  name: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastUpdated: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Pending';
  role: 'Admin' | 'Manager' | 'Employee' | 'Service' | 'None';
}

// Mappers between DTOs and DAOs
const AccountMapper = {
  toDTO(dao: AccountDAO): AccountDTO {
    return {
      id: dao.id,
      number: dao.number,
      name: dao.firstName || '',
      status: dao.status as AccountDTO['status'],
      lastUpdated: dao.updatedAt || new Date().toISOString(),
    };
  },

  toDAO(dto: Omit<AccountDTO, 'id'>): Omit<AccountDAO, 'id'> {
    return {
      number: dto.number,
      firstName: dto.name,
      status: dto.status,
      updatedAt: dto.lastUpdated,
    };
  },
};

const UserMapper = {
  toDTO(dao: UserDAO): User {
    return {
      id: dao.id,
      username: dao.username,
      email: dao.email,
      phoneNumber: dao.phoneNumber,
      status: dao.status as User['status'],
      role: (dao.role?.[0] || 'None') as User['role'],
    };
  },

  toDAO(dto: Omit<User, 'id'>): Omit<UserDAO, 'id'> {
    return {
      username: dto.username,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      status: dto.status,
      role: [dto.role],
      settings: {},  // Required by schema
    };
  },
};

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
  async createAccount(
    data: Omit<AccountDTO, 'id' | 'lastUpdated'>
  ): Promise<AccountDTO> {
    const userId = await getCurrentUserId();
    const dao = await client.models.Account.create({
      ...AccountMapper.toDAO({
        ...data,
        lastUpdated: new Date().toISOString(),
      }),
      id: uuidv4(),
      balance: 0,  // Required by schema
      noSales: 0,  // Required by schema
      noItems: 0,  // Required by schema
      lastActivityAt: new Date().toISOString(),  // Required by schema
      userId,  // Use actual user ID
    });
    return AccountMapper.toDTO(dao);
  },

  async updateAccount(
    number: string,
    data: Partial<AccountDTO>
  ): Promise<AccountDTO | undefined> {
    await getCurrentUserId(); // Ensure user is authenticated
    const existing = await client.models.Account.list({
      filter: { number: { eq: number } },
      limit: 1,
    });

    if (!existing.data[0]) return undefined;

    const dao = await client.models.Account.update({
      ...existing.data[0],
      ...AccountMapper.toDAO({
        ...data,
        number,
        lastUpdated: new Date().toISOString(),
      } as AccountDTO),
    });
    return AccountMapper.toDTO(dao);
  },

  async getAccountByNumber(number: string): Promise<AccountDTO | undefined> {
    await getCurrentUserId(); // Ensure user is authenticated
    const result = await client.models.Account.list({
      filter: { number: { eq: number } },
      limit: 1,
    });
    const dao = result.data[0];
    return dao ? AccountMapper.toDTO(dao) : undefined;
  },

  async getAccounts(
    options: PaginationOptions<AccountDTO>
  ): Promise<PaginatedResult<AccountDTO>> {
    await getCurrentUserId(); // Ensure user is authenticated
    const result = await client.models.Account.list({
      page: options.page - 1,
      limit: options.pageSize,
      sort: options.sortColumn
        ? { field: options.sortColumn, direction: options.sortDirection }
        : undefined,
    });

    return {
      items: result.data.map(AccountMapper.toDTO),
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
  async createUser(data: Omit<User, 'id'>): Promise<User> {
    await getCurrentUserId(); // Ensure user is authenticated
    const dao = await client.models.User.create({
      ...UserMapper.toDAO(data),
      id: uuidv4(),
    });
    return UserMapper.toDTO(dao);
  },

  async updateUser(
    email: string,
    data: Partial<User>
  ): Promise<User | undefined> {
    await getCurrentUserId(); // Ensure user is authenticated
    const existing = await client.models.User.list({
      filter: { email: { eq: email } },
      limit: 1,
    });

    if (!existing.data[0]) return undefined;

    const dao = await client.models.User.update({
      ...existing.data[0],
      ...UserMapper.toDAO({
        ...data,
        email,
      } as User),
    });
    return UserMapper.toDTO(dao);
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    await getCurrentUserId(); // Ensure user is authenticated
    const result = await client.models.User.list({
      filter: { email: { eq: email } },
      limit: 1,
    });
    const dao = result.data[0];
    return dao ? UserMapper.toDTO(dao) : undefined;
  },

  async getUsers(
    options: PaginationOptions<User>
  ): Promise<PaginatedResult<User>> {
    await getCurrentUserId(); // Ensure user is authenticated
    const result = await client.models.User.list({
      page: options.page - 1,
      limit: options.pageSize,
      sort: options.sortColumn
        ? { field: options.sortColumn, direction: options.sortDirection }
        : undefined,
    });

    return {
      items: result.data.map(UserMapper.toDTO),
      total: result.total,
      page: options.page,
      pageSize: options.pageSize,
      totalPages: Math.ceil(result.total / options.pageSize),
    };
  },

  async signUpUser(email: string, password: string): Promise<User | undefined> {
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