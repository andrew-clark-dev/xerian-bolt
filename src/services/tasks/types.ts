export interface TaskProgress {
  id: string;
  name: string;
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
  schedule: 'now' | 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  notifyOnComplete: boolean;
  upToDate?: Date;
}