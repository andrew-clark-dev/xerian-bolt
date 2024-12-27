import { apiClient } from '../../api/client';
import { importService } from './import.service';
import { ExternalAccountPage, ImportProgress, ImportResult } from '../types';

interface FetchAccountsOptions {
  cursor?: string | null;
  to?: Date | null;
  apiKey: string;
}

export class ImportAccountService {

  private serviceError(error: unknown, context: string): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    return new Error(`${context}: ${message}`);
  }


  private abortController: AbortController | null = null;

  private async fetchAccounts({
    cursor = null,
    to = null,
    apiKey,
  }: FetchAccountsOptions): Promise<ExternalAccountPage> {
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
          'default_split',
          'last_settlement',
          'number_of_purchases',
          'default_inventory_type',
          'default_terms',
          'last_item_entered',
          'number_of_items',
          'created_by',
          'last_activity',
          'locations',
          'recurring_fees',
          'tags',
        ],
        expand: ['created_by', 'locations', 'recurring_fees'],
      };

      if (cursor) {
        params['cursor'] = cursor;
      }

      if (to) {
        params['created:lte'] = to.toISOString();
      }

      apiClient.setAuthToken(apiKey);

      console.log('Fetching accounts with params:', params.toString());

      const response = await apiClient.get<ExternalAccountPage>(
        `/v1/accounts`, { params: params }
      );

      console.log('Received response:', response);

      return response;
    } catch (error) {
      throw this.serviceError(error, 'fetchAccounts');
    }
  }

  async *importAccounts(apiKey: string, upTo: Date): AsyncGenerator<ImportProgress, ImportResult> {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    let processed = 0;
    let failed = 0;
    const errors: Error[] = [];
    let cursor: string | null = null;
    let total = 0;

    try {
      const firstPage = await this.fetchAccounts({ apiKey, to: upTo });
      total = firstPage.count;

      do {
        if (signal.aborted) {
          throw new Error('Import cancelled');
        }

        const page = await this.fetchAccounts({
          cursor,
          to: upTo,
          apiKey,
        });

        for (const externalAccount of page.data) {
          if (signal.aborted) {
            throw new Error('Import cancelled');
          }

          try {
            console.log('Importing account:', externalAccount);
            await importService.create({ externalId: externalAccount.id, type: 'account', userId: externalAccount.created_by.id, data: JSON.stringify(externalAccount) });
            await importService.createIfNotExists({ externalId: externalAccount.created_by.id, type: 'user', userId: externalAccount.created_by.id, data: JSON.stringify(externalAccount.created_by) });

            processed++;
            yield {
              processed,
              total,
              message: `Imported account ${externalAccount.number} (${processed}/${total})`,
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