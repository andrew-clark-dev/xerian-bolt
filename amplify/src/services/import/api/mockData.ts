import { ModelType } from '../types';

export function generateMockData(modelType: ModelType, index: number): any {
  switch (modelType) {
    case 'Account':
      return {
        number: `ACC-${String(index).padStart(5, '0')}`,
        firstName: `John ${index}`,
        lastName: 'Doe',
        email: `john${index}@example.com`,
        status: 'Active',
      };
    case 'User':
      return {
        username: `user${index}`,
        email: `user${index}@example.com`,
        status: 'Active',
        role: ['Employee'],
      };
    case 'Item':
      return {
        sku: `ITEM-${String(index).padStart(5, '0')}`,
        title: `Item ${index}`,
        category: 'General',
        quantity: 1,
        split: 50,
        price: 1000,
      };
    default:
      return { 
        id: `${index}`, 
        name: `${modelType} ${index}` 
      };
  }
}