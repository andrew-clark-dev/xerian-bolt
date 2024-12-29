import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import type { ImportType } from '../../components/imports/ImportFilter';

const client = generateClient<Schema>();

export type ImportedObject = Schema['ImportedObject']['type'];

interface ListImportsOptions {
  limit?: number;
  nextToken?: string | null;
  type?: ImportType | 'all';
}

class ImportedObjectService {
  private serviceError(error: unknown, context: string): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    return new Error(`${context}: ${message}`);
  }

  async getImportedObject(externalId: string): Promise<ImportedObject> {
    if (!externalId) {
      throw new Error('Import ID is required');
    }

    try {
      const { data: importObj, errors } = await client.models.ImportedObject.get({ externalId });

      if (errors) {
        throw this.serviceError(errors, 'getImportedObject');
      }

      if (!importObj) {
        throw new Error(`Import with ID ${externalId} not found`);
      }

      return importObj;
    } catch (error) {
      throw this.serviceError(error, 'getImportedObject');
    }
  }

  async updateImportedObject(id: string, updates: Partial<ImportedObject>): Promise<ImportedObject> {
    if (!id) {
      throw new Error('Import ID is required');
    }

    try {
      const existingImport = await this.getImportedObject(id);

      const { data: importObj, errors } = await client.models.ImportedObject.update({
        ...existingImport,
        ...updates,
        externalId: id,
      });

      if (errors) {
        throw this.serviceError(errors, 'updateImportedObject');
      }

      if (!importObj) {
        throw new Error(`Failed to update import with ID ${id}`);
      }

      return importObj;
    } catch (error) {
      throw this.serviceError(error, 'updateImportedObject');
    }
  }

  async listImportedObjects(options: ListImportsOptions = {}): Promise<{
    imports: ImportedObject[];
    nextToken: string | null
  }> {
    try {
      const filter = options.type && options.type !== 'all'
        ? { type: { eq: options.type } }
        : undefined;

      const { data: imports, nextToken, errors } = await client.models.ImportedObject.list({
        limit: options.limit || 10,
        nextToken: options.nextToken,
        filter
      });

      if (errors) {
        throw this.serviceError(errors, 'listImportedObjects');
      }

      return { imports, nextToken: nextToken ?? null };
    } catch (error) {
      throw this.serviceError(error, 'listImportedObjects');
    }
  }
}

export const importedObjectService = new ImportedObjectService();