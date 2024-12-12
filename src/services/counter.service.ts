import { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

export type Counter = Schema['Counter']['type'];

class CounterService {

  private generateCounterTotalName(modelName: string): string {
    return `${modelName}Total`;
  }

  async findCounterTotal(modelName: string): Promise<Counter | null> {
    const response = await client.models.Counter.get({
      name: this.generateCounterTotalName(modelName),
    });

    return response.data;
  }


  async getCounterTotal(modelName: string): Promise<Counter> {
    const counter = await this.findCounterTotal(modelName);
    if (counter === null) {
      throw new Error('Counter not found');
    }
    return counter;
  }

  async initCounterTotal(modelName: string): Promise<Counter> {
    // Check if counter already exists
    const existingCounter = await this.findCounterTotal(modelName);
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
        name: this.generateCounterTotalName(modelName),
        count: 0,
      });
    }
    return response.data!;

  }

}

export const counterService = new CounterService();