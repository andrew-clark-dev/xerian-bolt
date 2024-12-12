import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { TaskResult } from './types';
import { counterService } from '../counter.service';

const client = generateClient<Schema>();

interface InitializeModelCountsConfig {
    onProgress: (progress: number, message: string) => void;
}

export class InitializeModelCountsTask {
    private config: InitializeModelCountsConfig;

    constructor(config: InitializeModelCountsConfig) {
        this.config = config;
    }



    async execute(): Promise<TaskResult> {
        try {
            // Get all model names from the Schema
            const modelNames = Object.keys(client.models) as (keyof typeof client.models)[];
            let processed = 0;

            for (const modelName of modelNames) {
                try {
                    // Update progress
                    const progress = (processed / modelNames.length) * 100;
                    this.config.onProgress(
                        progress,
                        `Processing model: ${modelName}`
                    );

                    // Initialize counter for the model
                    await counterService.initCounterTotal(modelName);

                    processed++;
                } catch (error) {
                    console.error(`Error processing model ${modelName}:`, error);
                }
            }

            return {
                success: true,
                message: `Successfully initialized counters for ${processed} models`,
                processed,
                failed: modelNames.length - processed,
                errors: [],
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Initialization failed: ${message}`,
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