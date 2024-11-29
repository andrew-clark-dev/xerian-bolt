import { ModelType } from '../types';
import { generateMockData } from './mockData';

export async function fetchBatch(modelType: ModelType, offset: number, limit: number): Promise<any[]> {
  try {
    // Simulated API call since we don't have a real endpoint yet
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = Array.from({ length: limit }, (_, index) => {
          return generateMockData(modelType, offset + index);
        });
        resolve(mockData);
      }, 300);
    });
  } catch (error) {
    console.error(`Failed to fetch batch for ${modelType}:`, error);
    throw new Error(`Failed to fetch batch for ${modelType}`);
  }
}