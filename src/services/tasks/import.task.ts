import { TaskResult } from './types';
import { ImportService, ImportConfig } from '../import.service';
import { DateRange } from '../import/types';
import { ImportType } from '../../components/imports/ImportFilter';

interface ImportTaskConfig {
  apiKey: string;
  dateRange: DateRange;
  onProgress: (progress: number, message: string) => void;
  importType: ImportType;
}

export class ImportTask {
  private importService: ImportService;
  private onProgress: (progress: number, message: string) => void;

  constructor(config: ImportConfig, onProgress: (progress: number, message: string) => void) {
    this.onProgress = onProgress;
    this.importService = new ImportService(config);

  }

  async execute(): Promise<TaskResult> {
    try {

      for await (const progress of this.importService.importItems()) {
        const percentComplete = (progress.processed / progress.total) * 100;
        this.onProgress(percentComplete, progress.message);
      }

      return {
        success: true,
        message: `Successfully imported all items`,
        processed: 0,
        failed: 0,
        errors: [],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        message: `Import failed: ${message}`,
        processed: 0,
        failed: 1,
        errors: [error instanceof Error ? error : new Error(message)],
      };
    }
  }

  abort(): void {
    this.importService.abort();
  }


  static create(taskConfig: ImportTaskConfig): ImportTask {
    const baseParams: Record<string, string | string[]> = {
      sort_by: 'created',
    };

    const configs: Record<string, { path: string; includes: string[]; expands: string[] }> = {
      accounts: {
        path: '/v1/accounts',
        includes: [
          'default_split', 'last_settlement', 'number_of_purchases', 'default_inventory_type',
          'default_terms', 'last_item_entered', 'number_of_items', 'created_by', 'last_activity',
          'locations', 'recurring_fees', 'tags'
        ],
        expands: ['created_by', 'locations', 'recurring_fees']
      },
      items: {
        path: '/v1/items',
        includes: [
          'batches', 'created_by', 'days_on_shelf', 'historic_consignor_portions',
          'historic_sale_prices', 'historic_store_portions', 'last_sold', 'last_viewed',
          'printed', 'split_price', 'surcharges', 'tags', 'tax_exempt', 'images'
        ],
        expands: ['account', 'category', 'created_by', 'surcharges', 'shelf', 'batches', 'images']
      },
      categories: {
        path: '/v1/categories',
        includes: ['parent', 'children', 'created_by', 'tags'],
        expands: ['parent', 'created_by']
      },
      sales: {
        path: '/v1/sales',
        includes: ['items', 'account', 'created_by', 'payments', 'refunds'],
        expands: ['items', 'account', 'created_by', 'payments', 'refunds']
      },
      users: {
        path: '/v1/users',
        includes: ['roles', 'permissions'],
        expands: ['roles']
      }
    };

    const config = configs[taskConfig.importType];
    const params = {
      ...baseParams,
      include: config.includes,
      expand: config.expands,
    };

    return new ImportTask({
      params,
      apiKey: taskConfig.apiKey,
      name: taskConfig.importType,
      path: config.path,
      dateRange: taskConfig.dateRange
    }, taskConfig.onProgress);
  }
}
