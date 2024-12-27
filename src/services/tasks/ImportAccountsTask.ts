import { ImportAccountService } from '../import/services/import.account.service';
import { TaskResult } from './types';
import { DateRange } from '../import/types';

interface ImportAccountsConfig {
  apiKey: string;
  dateRange?: DateRange;
  onProgress: (progress: number, message: string) => void;
}

export class ImportAccountsTask {
  private importService: ImportAccountService;
  private config: ImportAccountsConfig;

  constructor(config: ImportAccountsConfig) {
    this.importService = new ImportAccountService();
    this.config = config;
  }

  async execute(): Promise<TaskResult> {
    try {
      const dateRange = this.config.dateRange || {
        from: new Date(0), // Beginning of time
        to: new Date(),   // Current time
      };
      
      for await (const progress of this.importService.importAccounts(this.config.apiKey, dateRange)) {
        const percentComplete = (progress.processed / progress.total) * 100;
        this.config.onProgress(percentComplete, progress.message);
      }

      return {
        success: true,
        message: 'Successfully imported all accounts',
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