import { ModelType } from './types';

export function mapToModel(modelType: ModelType, item: any, userId: string): any {
  const now = new Date().toISOString();
  
  switch (modelType) {
    case 'Account':
      return {
        ...item,
        userId,
        balance: 0,
        noSales: 0,
        noItems: 0,
        lastActivityAt: now,
        createdAt: now,
        updatedAt: now,
      };
    case 'User':
      return {
        ...item,
        settings: {},
        createdAt: now,
        updatedAt: now,
      };
    case 'Item':
      return {
        ...item,
        userId,
        quantity: item.quantity || 1,
        createdAt: now,
        updatedAt: now,
      };
    default:
      return {
        ...item,
        userId,
        createdAt: now,
        updatedAt: now,
      };
  }
}