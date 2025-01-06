import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export type SyncData = Schema['SyncData']['type'];
export type SyncInterface = Schema['SyncInterface']['type'];

interface ListSyncDataOptions {
  limit?: number;
  nextToken?: string | null;
  sort?: {
    field: keyof SyncData;
    direction: 'asc' | 'desc';
  };
}

class SyncDataService {
  private serviceError(error: unknown, context: string): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    return new Error(`${context}: ${message}`);
  }

  async findSyncData(id: string): Promise<SyncData | null> {
    try {
      const { data: syncData, errors } = await client.models.SyncData.get({ id });

      if (errors) {
        throw this.serviceError(errors, 'findSyncData');
      }

      return syncData;
    } catch (error) {
      throw this.serviceError(error, 'findSyncData');
    }
  }

  async getSyncData(id: string): Promise<SyncData> {
    const syncData = await this.findSyncData(id);
    if (!syncData) {
      throw new Error('SyncData not found');
    }
    return syncData;
  }

  async createSyncData(syncData: Omit<SyncData, 'id'>): Promise<SyncData> {
    try {
      const { data: newSyncData, errors } = await client.models.SyncData.create(syncData);

      if (errors) {
        throw this.serviceError(errors, 'createSyncData');
      }

      return newSyncData!;
    } catch (error) {
      throw this.serviceError(error, 'createSyncData');
    }
  }

  async updateSyncData(id: string, updates: Partial<SyncData>): Promise<SyncData> {
    try {
      const existingSyncData = await this.getSyncData(id);

      const { data: syncData, errors } = await client.models.SyncData.update({
        ...existingSyncData,
        ...updates,
        id,
      });

      if (errors) {
        throw this.serviceError(errors, 'updateSyncData');
      }

      return syncData!;
    } catch (error) {
      throw this.serviceError(error, 'updateSyncData');
    }
  }

  async listSyncData(options: ListSyncDataOptions = {}): Promise<{ syncData: SyncData[]; nextToken: string | null }> {
    try {
      const {
        data: syncData,
        nextToken,
        errors
      } = await client.models.SyncData.list({
        limit: options.limit || 10,
        nextToken: options.nextToken,
      });

      if (errors) {
        throw this.serviceError(errors, 'listSyncData');
      }

      return { syncData: syncData, nextToken: nextToken ?? null };
    } catch (error) {
      throw this.serviceError(error, 'listSyncData');
    }
  }
}

export const syncDataService = new SyncDataService();