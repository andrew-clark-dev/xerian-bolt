import type { Schema } from '../../../../amplify/data/resource';

export type MaintenanceTaskName = 'Initialize Model Counts' | 'Truncate Table';
export type ModelType = keyof Schema;