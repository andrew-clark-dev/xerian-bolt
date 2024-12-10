import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import { Schema } from '../../../amplify/data/resource';
import { ImportConfig, ImportProgress, ImportResult } from './types';
import { fetchTotalCount, fetchBatch } from './api';
import { mergeConfig } from './config';

export class ImportService {
  private client = generateClient<Schema>();
  private config: Required<ImportConfig>;
  private abortController: AbortController | null = null;

  constructor(config: ImportConfig) {
    this.config = mergeConfig(config);
  }

  public async *execute(): AsyncGenerator<ImportProgress, ImportResult> {
    const total = await fetchTotalCount(this.config.modelType);
    let processed = 0;
    let failed = 0;
    const errors: Error[] = [];
    
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    try {
      const userId = await this.getCurrentUserId();
      
      while (processed < total && !signal.aborted) {
        const batch = await fetchBatch(
          this.config.modelType,
          processed,
          this.config.batchSize
        );
        
        for (const item of batch) {
          if (signal.aborted) break;
          
          try {
            await this.processItem(item, userId);
            processed++;
            
            yield {
              count: processed,
              total,
              message: `Processing ${this.config.modelType} ${processed} of ${total}`
            };
          } catch (error) {
            failed++;
            errors.push(error as Error);
            
            if (failed >= this.config.retryAttempts) {
              throw new Error(`Max retry attempts reached for ${this.config.modelType}`);
            }
            
            await this.delay(this.config.retryDelay);
          }
        }
      }

      const success = failed === 0 && !signal.aborted;
      const message = signal.aborted 
        ? 'Import cancelled'
        : `Import completed: ${processed} items processed, ${failed} failed`;

      return { success, message, processed, failed, errors };
    } catch (error) {
      return {
        success: false,
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        processed,
        failed,
        errors: [...errors, error instanceof Error ? error : new Error('Unknown error')]
      };
    }
  }

  public abort(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  private async getCurrentUserId(): Promise<string> {
    try {
      const { userId } = await getCurrentUser();
      return userId;
    } catch (err) {
      throw new Error('User must be authenticated');
    }
  }

  private async processItem(item: any, userId: string): Promise<void> {
    await this.client.models[this.config.modelType].create({
      ...item,
      userId
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}