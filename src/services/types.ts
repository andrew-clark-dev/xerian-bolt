import { Schema } from '@/amplify/data/resource';

// Use Amplify Schema type for Account DAO
export type AccountDAO = Schema['Account']['type'];

// Data Transfer Objects (DTOs)
export interface AccountDTO {
  id: string;
  number: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  lastUpdated: string;
}

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  role: 'admin' | 'manager' | 'employee' | 'none' | 'service';
}

// Data Access Object (DAO) for User
export interface UserDAO {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  status: string;
  role: string;
}

// Repository Interfaces
export interface Repository<T, K> {
  create(data: Omit<T, 'id'>): Promise<T>;
  update(key: K, data: Partial<T>): Promise<T | undefined>;
  findByKey(key: K): Promise<T | undefined>;
  list(options: PaginationOptions<T>): Promise<PaginatedResult<T>>;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationOptions<T> {
  page: number;
  pageSize: number;
  sortColumn?: keyof T;
  sortDirection?: 'asc' | 'desc';
}