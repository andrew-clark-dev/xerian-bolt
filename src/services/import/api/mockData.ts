import { ModelType } from '../types';

export function generateMockData(modelType: ModelType, index: number): any {
  const now = new Date().toISOString();
  
  switch (modelType) {
    case 'Account':
      return {
        number: `ACC-${String(index).padStart(5, '0')}`,
        name: `Test Account ${index}`,
        status: 'Active',
        balance: 0,
        noSales: 0,
        noItems: 0,
        lastActivityAt: now,
        createdAt: now,
        updatedAt: now,
      };
    case 'User':
      return {
        username: `user${index}`,
        email: `user${index}@example.com`,
        status: 'Active',
        role: ['Employee'],
        settings: {},
        createdAt: now,
        updatedAt: now,
      };
    case 'Item':
      return {
        sku: `ITEM-${String(index).padStart(5, '0')}`,
        title: `Item ${index}`,
        category: 'General',
        quantity: 1,
        split: 50,
        price: 1000,
        createdAt: now,
        updatedAt: now,
      };
    default:
      return {
        id: `${index}`,
        name: `${modelType} ${index}`,
        createdAt: now,
        updatedAt: now,
      };
  }
}