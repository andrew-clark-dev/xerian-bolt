import { ModelType } from '../types';

const mockCounts: Record<ModelType, number> = {
  Account: 1000,
  User: 500,
  Item: 2000,
  Transaction: 5000,
  Action: 100,
  Comment: 300,
  Counter: 50,
  Employee: 200,
  ItemCategory: 150
};

export async function fetchTotalCount(modelType: ModelType): Promise<number> {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCounts[modelType] || 100);
      }, 500);
    });
  } catch (error) {
    console.error(`Failed to fetch total count for ${modelType}:`, error);
    throw new Error(`Failed to get count for ${modelType}`);
  }
}