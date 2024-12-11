import axios from 'axios';
import { accountService } from '../../account.service';
import { userService } from '../../user.service';
import { mapExternalAccount } from '../data/mappers/account.mapper';
import { mapExternalUser } from '../data/mappers/user.mapper';
import type { ExternalAccountPage, ExternalUser } from '../data/types';

interface FetchAccountsOptions {
  cursor?: string | null;
  to?: Date | null;
  apiKey: string;
}

interface ImportProgress {
  processed: number;
  total: number;
  message: string;
}

interface ImportResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: Error[];
}

/**
 * Service for importing accounts from external API
 */
export class ImportAccountService {
  private readonly baseUrl = 'https://api.consigncloud.com';
  private readonly version = 'v1';
  private readonly defaultHeaders = {
    'Content-Type': 'application/json',
  };
  private abortController: AbortController | null = null;

  /**
   * Fetches a page of accounts from the external API
   */
  private async fetchAccounts({
    cursor = null,
    to = null,
    apiKey,
  }: FetchAccountsOptions): Promise<ExternalAccountPage> {
    const queryParams = new URLSearchParams({
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
      ].join(','),
      expand: ['created_by', 'locations', 'recurring_fees'].join(','),
    });

    if (cursor) {
      queryParams.append('cursor', cursor);
    }

    if (to) {
      queryParams.append('created:lte', `${to.toISOString()}Z`);
    }

    const url = new URL(
      `/api/${this.version}/accounts`,
      this.baseUrl
    );
    url.search = queryParams.toString();

    try {
      const response = await axios.get<ExternalAccountPage>(url.toString(), {
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${apiKey}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  }

  /**
   * Gets or creates a user based on the external user data
   */
  private async getOrCreateUser(externalUser: ExternalUser): Promise<string> {
    try {
      // Try to find existing user by username
      const user = await userService.findUserByName(externalUser.name);
      if (user) {
        return user.id;
      }

      // Create new user if not found
      const mappedUser = mapExternalUser(externalUser);
      const newUser = await userService.createUser(mappedUser);
      return newUser.id;

    } catch (error) {
      console.error('Error getting/creating user:', error);
      throw error;
    }
  }

  /**
   * Imports accounts from the external API, mapping and saving them to our system
   */
  async *importAccounts(apiKey: string, upTo: Date): AsyncGenerator<ImportProgress, ImportResult> {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    let processed = 0;
    let failed = 0;
    const errors: Error[] = [];
    let cursor: string | null = null;
    let total = 0;

    try {
      // Get initial page to determine total
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
            // Get or create user for the account
            const createdById = await this.getOrCreateUser(externalAccount.created_by);

            // Map external account to our format
            const mappedAccount = mapExternalAccount(externalAccount);

            // Check if account already exists
            const existingAccount = await accountService.findAccountByNumber(mappedAccount.number);

            if (existingAccount) {
              // Update existing account
              await accountService.updateAccount(existingAccount.id, {
                ...mappedAccount,
                userId: createdById, // Set the created by user
              });
            } else {
              // Create new account
              await accountService.createAccount({
                ...mappedAccount,
                userId: createdById, // Set the created by user
              });
            }

            processed++;
            yield {
              processed,
              total,
              message: `Imported account ${mappedAccount.number} (${processed}/${total})`,
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
        processed,
        failed,
        errors,
      };
    } catch (error) {
      return {
        success: false,
        processed,
        failed,
        errors: [...errors, error instanceof Error ? error : new Error('Unknown error')],
      };
    }
  }

  /**
   * Cancels the current import operation
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}