import { TaskResult } from './types';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

interface TruncateTableConfig {
    tableName: string;
    onProgress: (progress: number, message: string) => void;
}

export class TruncateTableTask {
    private config: TruncateTableConfig;

    constructor(config: TruncateTableConfig) {
        this.config = config;
    }

    async execute(): Promise<TaskResult> {
        try {
            this.config.onProgress(0, `Starting to truncate ${this.config.tableName}...`);

            const { errors } = await client.mutations.truncateTable({
                tablename: this.config.tableName.toUpperCase() + '_TABLE',
            });

            if (errors) {
                throw new Error(`Failed to truncate table: ${errors[0].message}`);
            }

            this.config.onProgress(100, `Successfully truncated ${this.config.tableName}`);

            return {
                success: true,
                message: `Successfully truncated ${this.config.tableName}`,
                processed: 1,
                failed: 0,
                errors: [],
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Truncate failed: ${message}`,
                processed: 0,
                failed: 1,
                errors: [error instanceof Error ? error : new Error(message)],
            };
        }
    }

    abort(): void {
        // This task is quick and doesn't support cancellation
    }
}