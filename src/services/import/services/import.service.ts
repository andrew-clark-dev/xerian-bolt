import { generateClient } from 'aws-amplify/data';

import type { Schema } from '../../../../amplify/data/resource';

const client = generateClient<Schema>();

export type ImportedObject = Omit<Schema['ImportedObject']['type'], 'updatedAt' | 'createdAt'>;


class ImportService {


  private importedUsers = new Set<ImportedObject>();


  private serviceError(error: unknown, context: string): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    return new Error(`${context}: ${message}`);
  }

  async exists(externalId: string): Promise<boolean> {
    try {
      const importedObject = await client.models.ImportedObject.get({ externalId });
      return importedObject.data != null; // Return true if the object exists, false otherwise
    } catch (error) {
      console.error('Error checking existence:', error);
      return false; // Return false in case of any other errors
    }
  }

  async createIfNotExists(importedObject: ImportedObject): Promise<boolean> {
    if (await this.exists(importedObject.externalId)) {
      return false;
    } else {
      await this.create(importedObject);
      return true;
    }
  }


  async create(importedObject: ImportedObject) {

    const { data, errors } = await client.models.ImportedObject.create(importedObject);
    console.log(`Created ${data?.type} Object with user ${data?.userId} `);

    if (errors) {
      throw this.serviceError(errors, 'create');
    }


  }

  async update(importedObject: ImportedObject) {

    const { errors } = await client.models.ImportedObject.update(importedObject);

    if (errors) {
      throw this.serviceError(errors, 'update');
    }


  }
  async addUser(importedObject: ImportedObject) {
    this.importedUsers.add(importedObject);
  }

  async createUsers() {
    this.importedUsers.forEach(importedObject => this.create(importedObject));
  }


}

export const importService = new ImportService();

