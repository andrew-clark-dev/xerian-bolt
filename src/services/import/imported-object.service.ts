import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { createServiceError } from './utils/error.utils';
import { ImportType } from '../../components/imports/ImportFilter';

const client = generateClient<Schema>();

export type ImportedObject = Schema['ImportedObject']['type'];

export interface ListImportsOptions {
  limit?: number;
  nextToken?: string | null;
  type?: ImportType | 'all';
}

export interface ImportResult {
  imports: ImportedObject[];
  nextToken: string | null;
}

class ImportedObjectService {
  async getImportedObject(externalId: string): Promise<ImportedObject> {
    if (!externalId) {
      throw new Error('Import ID is required');
    }

    try {
      const { data: importObj, errors } = await client.models.ImportedObject.get({ externalId });

      if (errors) {
        throw createServiceError(errors, 'getImportedObject');
      }

      if (!importObj) {
        throw new Error(`Import with ID ${externalId} not found`);
      }

      return importObj;
    } catch (error) {
      throw createServiceError(error, 'getImportedObject');
    }
  }

  async updateImportedObject(externalId: string, updates: Partial<ImportedObject>): Promise<ImportedObject> {
    if (!externalId) {
      throw new Error('Import ID is required');
    }

    try {
      const existingImport = await this.getImportedObject(externalId);

      const { data: importObj, errors } = await client.models.ImportedObject.update({
        ...existingImport,
        ...updates,
        externalId,
      });

      if (errors) {
        throw createServiceError(errors, 'updateImportedObject');
      }

      if (!importObj) {
        throw new Error(`Failed to update import with ID ${externalId}`);
      }

      return importObj;
    } catch (error) {
      throw createServiceError(error, 'updateImportedObject');
    }
  }

  async listImportedObjects(options: ListImportsOptions = {}): Promise<ImportResult> {
    try {
      const filter = options.type && options.type !== 'all'
        ? { type: { eq: options.type } }
        : undefined;

      const { data: imports, nextToken, errors } = await client.models.ImportedObject.list({
        limit: options.limit || 10,
        nextToken: options.nextToken,
        filter: filter
      });

      if (errors) {
        throw createServiceError(errors, 'listImportedObjects');
      }

      return { imports, nextToken: nextToken ?? null };
    } catch (error) {
      throw createServiceError(error, 'listImportedObjects');
    }
  }
}

export const importedObjectService = new ImportedObjectService();