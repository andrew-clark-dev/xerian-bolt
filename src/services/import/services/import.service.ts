import type { DateRange, ImportProgress, ImportResult } from '../types';
import { apiClient } from '../../api/client';
import { AxiosError } from 'axios';

import { generateClient } from 'aws-amplify/data';

import type { Schema } from '../../../../amplify/data/resource';

const client = generateClient<Schema>();

export type ImportedObject = Omit<Schema['ImportedObject']['type'], 'updatedAt' | 'createdAt'>;

export interface ExternalUser {
  id: string;
  name: string;
  user_type: string;
}

export interface ExternalItem {
  id: string;
  created_by: ExternalUser;
}

export interface ExternalItemPage {
  count: number;
  data: ExternalItem[];
  next_cursor: string | null;
}


export interface ImportConfig {
  params: Record<string, string | string[]>;
  apiKey: string
  name: string;
  path: string;
  dateRange: DateRange;
}

export class ImportService {
  config: ImportConfig;


  constructor(config: ImportConfig) {
    this.config = config;
    apiClient.setAuthToken(config.apiKey);
  }


  // protected serviceError(error: unknown, context: string): Error {
  //   const message = error instanceof Error ? error.message : 'Unknown error';
  //   console.error(`Error in ${context}:`, error);
  //   return new Error(`${context}: ${message}`);
  // }

  protected abortController: AbortController | null = null;

  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  private async fetchItems(cursor?: string | null): Promise<ExternalItemPage> {
    const params = this.config.params;
    try {
      params['created:gte'] = this.config.dateRange.from.toISOString();
      params['created:lte'] = this.config.dateRange.to.toISOString();


      if (cursor) {
        params.cursor = cursor;
      }


      return await apiClient.get<ExternalItemPage>(this.config.path, { params });

    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response);
        if (error.response?.status == 429) {
          // Too many requests, wait and try again
          console.log("Too many requests, wait and try again");
          await new Promise(resolve => setTimeout(resolve, 5000));
          return this.fetchItems(cursor);
        }
        console.error(`AxiosError (${error.response?.status}) in fetchItems:`, error);
      }
      throw error;
    }
  }

  async *importItems(): AsyncGenerator<ImportProgress, ImportResult> {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    let processed = 0;
    let failed = 0;
    const errors: Error[] = [];
    let cursor: string | null = null;
    let total = 0;

    // Create a Set to track inserted users
    const insertedUsers = new Set<string>();


    try {
      const startTime = performance.now();

      const firstPage = await this.fetchItems();
      total = firstPage.count;
      yield {
        processed,
        total,
        message: `Found ${total} ${this.config.name}s to import`,
      };


      do {
        if (signal.aborted) {
          throw new Error('Import cancelled');
        }

        const page = await this.fetchItems(cursor);

        for (const externalItem of page.data) {
          if (signal.aborted) {
            throw new Error('Import cancelled');
          }

          try {
            this.createIfNotExists({
              externalId: externalItem.id,
              type: this.config.name,
              userId: externalItem.created_by.id,
              data: JSON.stringify(externalItem)
            });

            if (!insertedUsers.has(externalItem.created_by.id)) {
              this.createIfNotExists({
                externalId: externalItem.created_by.id,
                type: 'user',
                userId: externalItem.created_by.id,
                data: JSON.stringify(externalItem.created_by)
              });
              insertedUsers.add(externalItem.created_by.id);
            }
            processed++;
            yield {
              processed,
              total,
              message: `Imported ${this.config.name} ${externalItem.id} (${processed}/${total})`,
            };
          } catch (error) {
            failed++;
            errors.push(error instanceof Error ? error : new Error('Unknown error'));
            console.error('Error importing ${this.config.name}:', error);
          }
        }

        cursor = page.next_cursor;
      } while (cursor);

      const endTime = performance.now();
      const elapsedTime = (endTime - startTime) / 1000;
      console.log(`Elapsed time: ${elapsedTime} ms`);
      let message = `Import completed successfully, imported ${processed} ${this.config.name}s in ${elapsedTime} seconds`;

      if (signal.aborted) {
        message = `Import cancelled by user, imported ${processed} ${this.config.name}s in ${elapsedTime} seconds`;
      }

      if (failed > 0) {
        message = `Import encountered errors, imported ${processed} ${this.config.name}s in ${elapsedTime} seconds`;
      }

      return {
        success: failed === 0 && !signal.aborted,
        message: message,
        processed,
        failed,
        errors,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Import encountered errors',
        processed,
        failed,
        errors: [...errors, error instanceof Error ? error : new Error('Unknown error')],
      };
    }
  }

  async exists(externalId: string): Promise<boolean> {
    try {
      const importedObject = await client.models.ImportedObject.get({ externalId });
      return importedObject.data != null; // Return true if the object exists, false otherwise
    } catch (error) {
      console.error('Error checking existence:', error);
      return false; // Return false in case of any other errors
    }
  }

  async createIfNotExists(importedObject: ImportedObject): Promise<boolean> {
    if (await this.exists(importedObject.externalId)) {
      return false;
    } else {
      await this.create(importedObject);
      return true;
    }
  }

  async create(importedObject: ImportedObject) {

    const { data, errors } = await client.models.ImportedObject.create(importedObject);
    console.log(`Created ${data?.type} Object with user ${data?.userId} `);

    if (errors) {
      throw new Error(`Errors in create importtedObject: ${errors}`);
    }


  }

}


