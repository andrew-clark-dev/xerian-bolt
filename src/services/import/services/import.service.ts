import { generateClient } from 'aws-amplify/data';

import type { Schema } from '../../../../amplify/data/resource';

const client = generateClient<Schema>();

export type ImportedObject = Omit<Schema['ImportedObject']['type'], 'updatedAt' | 'createdAt'>;


class ImportService {

  private serviceError(error: unknown, context: string): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    return new Error(`${context}: ${message}`);
  }

  async exists(externalId: string, type: string): Promise<boolean> {
    try {
      const importedObject = await client.models.ImportedObject.get({ externalId, type });
      return !!importedObject; // Return true if the Todo exists, false otherwise
    } catch (error) {
      console.error('Error checking Todo existence:', error);
      return false; // Return false in case of any other errors
    }
  }

  async createIfNotExists(importedObject: ImportedObject): Promise<boolean> {
    if (await this.exists(importedObject.externalId, importedObject.type)) {
      try {
        const { errors } = await client.models.ImportedObject.create({ ...importedObject });

        if (errors) {
          throw this.serviceError(errors, 'createIfNotExists');
        }

        return true;
      } catch (error) {
        throw this.serviceError(error, 'createUserProfile');
      }
    }
    return false;

  }

}

export const importService = new ImportService();

