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
        name: 'Initialize Model Counts',
        modelType: 'Counter',
        requiresApiKey: false,
    }
];