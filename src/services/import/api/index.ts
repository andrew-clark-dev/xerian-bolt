import { ModelType } from '../types';
import { generateMockData } from './mockData';

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
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCounts[modelType] || 100);
    }, 500);
  });
}

export async function fetchBatch(modelType: ModelType, offset: number, limit: number): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = Array.from({ length: limit }, (_, index) => {
        return generateMockData(modelType, offset + index);
      });
      resolve(mockData);
    }, 300);
  });
}