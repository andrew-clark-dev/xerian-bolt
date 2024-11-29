import { Schema } from '../../../amplify/data/resource';

export type ModelType = keyof Schema;

export interface ImportProgress {
  count: number;
  total: number;
  message: string;
}

export interface ImportConfig {
  modelType: ModelType;
  batchSize?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ImportResult {
  success: boolean;
  message: string;
  processed: number;
  failed: number;
  errors: Error[];
}