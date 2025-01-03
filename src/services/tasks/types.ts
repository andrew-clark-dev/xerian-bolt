import type { Schema } from '../../../amplify/data/resource';
import type { DateRange } from '../import/types';

export type ModelType = keyof Schema;

export interface TaskProgress {
  id: string;
  name: string;
  modelType: ModelType;
  progress: number;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  message: string;
  startedAt: Date;
  completedAt?: Date;
}

export interface TaskResult {
  success: boolean;
  message: string;
  processed: number;
  failed: number;
  errors: Error[];
}

export interface TaskConfig {
  name: string;
  modelType: ModelType;
  schedule: 'now' | 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  notifyOnComplete: boolean;
  dateRange: DateRange;
}