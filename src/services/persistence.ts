import { v4 as uuidv4 } from 'uuid';
import { generateClient } from 'aws-amplify/data';
import {
  type AccountDTO,
  type UserDTO,
  type AccountDAO,
  type UserDAO,
  type PaginatedResult,
  type PaginationOptions,
  type Repository
} from './types';
import { AccountMapper, UserMapper } from './mappers';

const client = generateClient();

class AccountRepository implements Repository<AccountDTO, string> {
  async create(data: Omit<AccountDTO, 'id'>): Promise<AccountDTO> {
    const dao = await client.models.Account.create({
      ...AccountMapper.toDAO(data),
    });
    return AccountMapper.toDTO(dao);
  }

  async update(number: string, data: Partial<AccountDTO>): Promise<AccountDTO | undefined> {
    const existing = await this.findByKey(number);
    if (!existing) return undefined;

    const dao = await client.models.Account.update({
      id: existing.id,
      ...AccountMapper.toDAO({ ...existing, ...data } as AccountDTO),
      lastUpdated: new Date().toISOString(),
    });
    return AccountMapper.toDTO(dao);
  }

  async findByKey(number: string): Promise<AccountDTO | undefined> {
    const { data } = await client.models.Account.list({
      filter: { number: { eq: number } },
      limit: 1,
    });
    const dao = data[0];
    return dao ? AccountMapper.toDTO(dao) : undefined;
  }

  async list(options: PaginationOptions<AccountDTO>): Promise<PaginatedResult<AccountDTO>> {
    const { page, pageSize, sortColumn, sortDirection } = options;

    const { data, count } = await client.models.Account.list({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: sortColumn && sortDirection ? { [sortColumn]: sortDirection } : undefined,
    });

    const totalPages = Math.ceil(count / pageSize);
    const items = data.map(AccountMapper.toDTO);

    return {
      items,
      total: count,
      page,
      pageSize,
      totalPages,
    };
  }

  async getNextNumber(): Promise<string> {
    const { data } = await client.models.Account.list({
      order: { number: 'desc' },
      limit: 1,
    });
    
    const lastNumber = data[0]?.number;
    const nextNumber = lastNumber 
      ? parseInt(lastNumber.replace('ACC-', ''), 10) + 1
      : 1;
    return `ACC-${String(nextNumber).padStart(5, '0')}`;
  }
}

class UserRepository implements Repository<UserDTO, string> {
  private storage: UserDAO[] = [];

  async create(data: Omit<UserDTO, 'id'>): Promise<UserDTO> {
    const dao: UserDAO = {
      id: uuidv4(),
      ...UserMapper.toDAO(data),
    };
    this.storage.push(dao);
    return UserMapper.toDTO(dao);
  }

  async update(email: string, data: Partial<UserDTO>): Promise<UserDTO | undefined> {
    const index = this.storage.findIndex(u => u.email === email);
    if (index === -1) return undefined;

    const updatedDao = {
      ...this.storage[index],
      ...UserMapper.toDAO({ ...this.storage[index], ...data } as UserDTO),
    };
    this.storage[index] = updatedDao;
    return UserMapper.toDTO(updatedDao);
  }

  async findByKey(email: string): Promise<UserDTO | undefined> {
    const dao = this.storage.find(u => u.email === email);
    return dao ? UserMapper.toDTO(dao) : undefined;
  }

  async list(options: PaginationOptions<UserDTO>): Promise<PaginatedResult<UserDTO>> {
    const { page, pageSize, sortColumn, sortDirection } = options;
    let items = [...this.storage];

    if (sortColumn && sortDirection) {
      items.sort((a, b) => {
        const aValue = a[sortColumn as keyof UserDAO];
        const bValue = b[sortColumn as keyof UserDAO];
        const comparison = String(aValue).localeCompare(String(bValue));
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    const total = items.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items
      .slice(startIndex, startIndex + pageSize)
      .map(UserMapper.toDTO);

    return {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
}

const accountRepository = new AccountRepository();
const userRepository = new UserRepository();

// Persistence Service
export const persistenceService = {
  // Account methods
  createAccount: (data: Omit<AccountDTO, 'id'>) => accountRepository.create(data),
  updateAccount: (number: string, data: Partial<AccountDTO>) => accountRepository.update(number, data),
  getAccountByNumber: (number: string) => accountRepository.findByKey(number),
  getAccounts: (options: PaginationOptions<AccountDTO>) => accountRepository.list(options),
  getNextAccountNumber: () => accountRepository.getNextNumber(),

  // User methods
  createUser: (data: Omit<UserDTO, 'id'>) => userRepository.create(data),
  updateUser: (email: string, data: Partial<UserDTO>) => userRepository.update(email, data),
  getUserByEmail: (email: string) => userRepository.findByKey(email),
  getUsers: (options: PaginationOptions<UserDTO>) => userRepository.list(options),
};

// Type exports
export type { AccountDTO as Account, UserDTO as User } from './types';
export type { PaginatedResult, PaginationOptions } from './types';