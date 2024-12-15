import { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

export type Counter = Schema['Counter']['type'];

class CounterService {

  private serviceError(error: unknown, context: string): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    return new Error(`${context}: ${message}`);
  }

  async next(modelName: string): Promise<number> {
    return (await this.nextCounter(modelName)).count;
  }


  async nextCounter(modelName: string): Promise<Counter> {
    try {
      const { data, errors } = await client.mutations.incCounter({ name: modelName });

      if (errors) {
        throw this.serviceError(errors, 'nextCounter');
      }

      return data!;
    } catch (error) {
      throw this.serviceError(error, 'nextCounter');
    }
  }


  async findTotal(modelName: string): Promise<Counter | null> {
    const response = await client.models.Counter.get({
      name: `${modelName}Total`,
    });

    return response.data;
  }

  async findCounter(counterName: string): Promise<Counter | null> {
    const response = await client.models.Counter.get({
      name: counterName,
    });

    return response.data;
  }


  async getTotal(modelName: string): Promise<Counter> {
    const counter = await this.findTotal(modelName);
    if (counter === null) {
      throw new Error('Counter not found');
    }
    return counter;
  }

  async initCounters(modelName: string): Promise<Counter> {
    this.initCounter(`${modelName}Total`);
    return this.initCounter(modelName);

  }

  async initCounter(counterName: string): Promise<Counter> {
    // Check if counter already exists
    const existingCounter = await this.findCounter(counterName);
    let response;
    if (existingCounter) {
      // Update existing counter
      response = await client.models.Counter.update({
        ...existingCounter,
        count: 0,
      });
    } else {
      // Create new counter
      response = await client.models.Counter.create({
        name: counterName,
        count: 0,
      });
    }
    return response.data!;
  }

}

export const counterService = new CounterService();