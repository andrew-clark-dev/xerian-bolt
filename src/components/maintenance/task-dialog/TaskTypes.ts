import type { ModelType } from '../../../services/tasks/types';

export interface TaskType {
    name: string;
    modelType: ModelType;
    requiresApiKey: boolean;
}

export const taskTypes: TaskType[] = [
    {
        name: 'Import Accounts',
        modelType: 'Account',
        requiresApiKey: true,
    },
    {
        name: 'Import Items',
        modelType: 'Item',
        requiresApiKey: true,
    },
    {
        name: 'Import Categories',
        modelType: 'ItemCategory',
        requiresApiKey: true,
    },
    {
        name: 'Import Sales',
        modelType: 'Transaction',
        requiresApiKey: true,
    },
    {
        name: 'Import Users',
        modelType: 'UserProfile',
        requiresApiKey: true,
    },
    {
        name: 'Initialize Model Counts',
        modelType: 'Counter',
        requiresApiKey: false,
    },
    {
        name: 'Truncate Table',
        modelType: 'Account',
        requiresApiKey: false,
    }
];