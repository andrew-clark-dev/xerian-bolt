import { ModelType } from './types';

export async function fetchTotalCount(modelType: ModelType): Promise<number> {
  try {
    // Simulated API call since we don't have a real endpoint yet
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return mock counts based on model type
        const mockCounts = {
          Account: 1000,
          User: 500,
          Item: 2000,
          Transaction: 5000,
        };
        resolve(mockCounts[modelType] || 100);
      }, 500);
    });
  } catch (error) {
    console.error(`Failed to fetch total count for ${modelType}:`, error);
    throw new Error(`Failed to get count for ${modelType}`);
  }
}

export async function fetchBatch(modelType: ModelType, offset: number, limit: number): Promise<any[]> {
  try {
    // Simulated API call since we don't have a real endpoint yet
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate mock data based on model type
        const mockData = Array.from({ length: limit }, (_, index) => {
          const itemIndex = offset + index;
          switch (modelType) {
            case 'Account':
              return {
                number: `ACC-${String(itemIndex).padStart(5, '0')}`,
                firstName: `John ${itemIndex}`,
                lastName: 'Doe',
                email: `john${itemIndex}@example.com`,
                status: 'Active',
              };
            case 'User':
              return {
                username: `user${itemIndex}`,
                email: `user${itemIndex}@example.com`,
                status: 'Active',
                role: ['Employee'],
              };
            default:
              return { id: `${itemIndex}`, name: `Item ${itemIndex}` };
          }
        });
        resolve(mockData);
      }, 300);
    });
  } catch (error) {
    console.error(`Failed to fetch batch for ${modelType}:`, error);
    throw new Error(`Failed to fetch batch for ${modelType}`);
  }
}