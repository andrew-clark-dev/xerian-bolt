import type { DateRange } from '../types';

export interface FetchOptions {
  cursor?: string | null;
  dateRange?: DateRange | null;
  apiKey: string;
}

export abstract class BaseImportService {
  protected serviceError(error: unknown, context: string): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    return new Error(`${context}: ${message}`);
  }

  protected getDateRangeParams(dateRange: DateRange | null) {
    if (!dateRange) return {};

    return {
      'created:gte': dateRange.from.toISOString(),
      'created:lte': dateRange.to.toISOString(),
    };
  }

  protected abortController: AbortController | null = null;

  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}