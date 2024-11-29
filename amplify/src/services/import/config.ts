import { ImportConfig } from './types';

export const DEFAULT_CONFIG: Required<ImportConfig> = {
  batchSize: 100,
  retryAttempts: 3,
  retryDelay: 1000,
  modelType: 'Account'
};

export function mergeConfig(config: ImportConfig): Required<ImportConfig> {
  return {
    ...DEFAULT_CONFIG,
    ...config
  };
}