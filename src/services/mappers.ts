import { AccountDTO, AccountDAO, User, UserDAO } from './types';

export const AccountMapper = {
  toDTO(dao: AccountDAO): AccountDTO {
    return {
      id: dao.id,
      number: dao.number,
      name: dao.name,
      status: dao.status as AccountDTO['status'],
      lastUpdated: dao.lastUpdated,
    };
  },

  toDAO(dto: Omit<AccountDTO, 'id'>): Omit<AccountDAO, 'id'> {
    return {
      number: dto.number,
      name: dto.name,
      status: dto.status,
      lastUpdated: dto.lastUpdated,
    };
  },
};

export const UserMapper = {
  toDTO(dao: UserDAO): User {
    return {
      id: dao.id,
      username: dao.username,
      email: dao.email,
      phoneNumber: dao.phoneNumber,
      status: dao.status as User['status'],
      role: dao.role as User['role'],
    };
  },

  toDAO(dto: Omit<User, 'id'>): Omit<UserDAO, 'id'> {
    return {
      username: dto.username,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      status: dto.status,
      role: dto.role,
    };
  },
};