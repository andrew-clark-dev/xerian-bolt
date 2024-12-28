import { apiClient } from '../../api/client';
import { importService } from './import.service';
import { BaseImportService, FetchOptions } from './base.import.service';
import { ExternalItemPage, ImportProgress, ImportResult, DateRange } from '../types';
import { AxiosError } from 'axios';

export class ImportItemService extends BaseImportService {
  private async fetchItems({
    cursor = null,
    dateRange = null,
    apiKey,
  }: FetchOptions): Promise<ExternalItemPage> {
    try {
      const params: Record<string, string | string[]> = {
        sort_by: 'created',
        include: [
          'batches', 'created_by', 'days_on_shelf', 'historic_consignor_portions',
          'historic_sale_prices', 'historic_store_portions', 'last_sold',
          'last_viewed', 'printed', 'split_price', 'surcharges',
          'tags', 'tax_exempt', 'images'
        ],
        expand: ['account', 'category', 'created_by', 'surcharges', 'shelf', 'batches', 'images'],
      };

      const dateRangeParams = this.getDateRangeParams(dateRange);
      if (dateRangeParams['created:gte']) {
        params['created:gte'] = dateRangeParams['created:gte'];
      }
      if (dateRangeParams['created:lte']) {
        params['created:lte'] = dateRangeParams['created:lte'];
      }

      if (cursor) {
        params.cursor = cursor;
      }

      apiClient.setAuthToken(apiKey);
      return await apiClient.get<ExternalItemPage>('/v1/items', { params });

    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response);
        //        if (error.status === 429) {
        // Too many requests, wait and try again
        console.log("Too many requests, wait and try again");

        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.fetchItems({ cursor, dateRange, apiKey });
        //      }
      }
      throw this.serviceError(error, 'fetchItems');
    }
  }

  async *importItems(apiKey: string, dateRange: DateRange): AsyncGenerator<ImportProgress, ImportResult> {
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

      const firstPage = await this.fetchItems({ apiKey, dateRange });
      total = firstPage.count;
      yield {
        processed,
        total,
        message: `Found ${total} items to import`,
      };


      do {
        if (signal.aborted) {
          throw new Error('Import cancelled');
        }
        const page = await this.fetchItems({
          cursor,
          dateRange,
          apiKey,
        });

        for (const externalItem of page.data) {
          if (signal.aborted) {
            throw new Error('Import cancelled');
          }

          try {
            importService.create({
              externalId: externalItem.id,
              type: 'item',
              userId: externalItem.created_by.id,
              data: JSON.stringify(externalItem)
            });

            if (!insertedUsers.has(externalItem.created_by.id)) {
              importService.createIfNotExists({
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
              message: `Imported item ${externalItem.sku} (${processed}/${total})`,
            };
          } catch (error) {
            failed++;
            errors.push(error instanceof Error ? error : new Error('Unknown error'));
            console.error('Error importing item:', error);
          }
        }

        cursor = page.next_cursor;
      } while (cursor);

      const endTime = performance.now();
      const elapsedTime = (endTime - startTime) / 1000;
      console.log(`Elapsed time: ${elapsedTime} ms`);
      let message = `Import completed successfully, imported ${processed} items in ${elapsedTime} seconds`;

      if (signal.aborted) {
        message = `Import cancelled by user, imported ${processed} items in ${elapsedTime} seconds`;
      }

      if (failed > 0) {
        message = `Import encountered errors, imported ${processed} items in ${elapsedTime} seconds`;
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
}