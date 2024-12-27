import { apiClient } from '../../api/client';
import { importService } from './import.service';
import { ExternalItemPage, ImportProgress, ImportResult } from '../types';

interface FetchItemsOptions {
  cursor?: string | null;
  to?: Date | null;
  apiKey: string;
}

export class ImportItemService {

  private serviceError(error: unknown, context: string): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    return new Error(`${context}: ${message}`);
  }


  private abortController: AbortController | null = null;

  private async fetchItems({
    cursor = null,
    to = null,
    apiKey,
  }: FetchItemsOptions): Promise<ExternalItemPage> {
    try {
      const params: {
        sort_by: string;
        include: string[];
        expand: string[];
        cursor?: string;
        'created:lte'?: string;
      } = {
        sort_by: 'created',
        include: [
          'batches', 'created_by', 'days_on_shelf', 'historic_consignor_portions', 'historic_sale_prices',
          'historic_store_portions', 'last_sold', 'last_viewed', 'printed', 'split_price', 'surcharges',
          'tags', 'tax_exempt', 'images'
        ],
        expand: ['account', 'category', 'created_by', 'surcharges', 'shelf', 'batches', 'images'],
      };

      if (cursor) {
        params['cursor'] = cursor;
      }

      if (to) {
        params['created:lte'] = to.toISOString();
      }

      apiClient.setAuthToken(apiKey);

      console.log('Fetching items with params:', params.toString());

      const response = await apiClient.get<ExternalItemPage>(
        `/v1/items`, { params: params }
      );

      console.log('Received response:', response);

      return response;
    } catch (error) {
      throw this.serviceError(error, 'fetchItems');
    }
  }

  async *importItems(apiKey: string, upTo: Date): AsyncGenerator<ImportProgress, ImportResult> {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    let processed = 0;
    let failed = 0;
    const errors: Error[] = [];
    let cursor: string | null = null;
    let total = 0;

    try {
      const firstPage = await this.fetchItems({ apiKey, to: upTo });
      total = firstPage.count;

      do {
        if (signal.aborted) {
          throw new Error('Import cancelled');
        }

        const page = await this.fetchItems({
          cursor,
          to: upTo,
          apiKey,
        });

        for (const externalItem of page.data) {
          if (signal.aborted) {
            throw new Error('Import cancelled');
          }

          try {
            await importService.createIfNotExists({ externalId: externalItem.id, type: 'account', userId: externalItem.created_by.id, data: JSON.stringify(externalItem) });
            await importService.createIfNotExists({ externalId: externalItem.created_by.id, type: 'user', userId: externalItem.created_by.id, data: JSON.stringify(externalItem.created_by) });

            processed++;
            yield {
              processed,
              total,
              message: `Imported account ${externalItem.number} (${processed}/${total})`,
            };
          } catch (error) {
            failed++;
            errors.push(error instanceof Error ? error : new Error('Unknown error'));
            console.error('Error importing account:', error);
          }
        }

        cursor = page.next_cursor;
      } while (cursor);

      return {
        success: failed === 0 && !signal.aborted,
        message: failed === 0 && !signal.aborted ? 'Import completed successfully' : 'Import encountered errors',
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

  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}