import { TaskResult } from './types';
import { ImportService, ImportConfig } from '../import/services/import.service';
import { DateRange } from '../import/types';

interface UIParams {
  apiKey: string, dateRange: DateRange, onProgress: (progress: number, message: string) => void
}

export abstract class ImportTask {
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
}


export class ImportAccountsTask extends ImportTask {

  constructor(uiParams: UIParams) {
    const params: Record<string, string | string[]> = {
      sort_by: 'created',
      include: [
        'default_split', 'last_settlement', 'number_of_purchases', 'default_inventory_type', 'default_terms',
        'last_item_entered', 'number_of_items', 'created_by', 'last_activity', 'locations', 'recurring_fees',
        'tags',
      ],
      expand: ['created_by', 'locations', 'recurring_fees'],
    };

    super({
      params: params,
      apiKey: uiParams.apiKey,
      name: 'account',
      path: '/v1/accounts',
      dateRange: uiParams.dateRange
    },
      uiParams.onProgress
    );
  }
}

export class ImportItemsTask extends ImportTask {

  constructor(uiParams: UIParams) {
    const params: Record<string, string | string[]> = {
      sort_by: 'created',
      include: [
        'batches', 'created_by', 'days_on_shelf', 'historic_consignor_portions', 'historic_sale_prices',
        'historic_store_portions', 'last_sold', 'last_viewed', 'printed', 'split_price', 'surcharges',
        'tags', 'tax_exempt', 'images'
      ],
      expand: ['account', 'category', 'created_by', 'surcharges', 'shelf', 'batches', 'images'],
    };
    super({
      params: params,
      apiKey: uiParams.apiKey,
      name: 'item',
      path: '/v1/items',
      dateRange: uiParams.dateRange
    },
      uiParams.onProgress
    );
  }
}