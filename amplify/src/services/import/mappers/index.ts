import { ModelType } from '../types';
import { mapAccount } from './accountMapper';
import { mapUser } from './userMapper';
import { mapItem } from './itemMapper';

export function mapToModel(modelType: ModelType, item: any, userId: string): any {
  const now = new Date().toISOString();
  
  switch (modelType) {
    case 'Account':
      return mapAccount(item, userId);
    case 'User':
      return mapUser(item);
    case 'Item':
      return mapItem(item, userId);
    default:
      return {
        ...item,
        userId,
        createdAt: now,
        updatedAt: now,
      };
  }
}