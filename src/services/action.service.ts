import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export type Action = Schema['Action']['type'];
export type ActionType = Schema['Action']['type']['type'];

interface ListActionsOptions {
  limit?: number;
  nextToken?: string | null;
  sort?: {
    field: keyof Action;
    direction: 'asc' | 'desc';
  };
}

class ActionService {
  private serviceError(error: unknown, context: string): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${context}:`, error);
    return new Error(`${context}: ${message}`);
  }

  async findAction(id: string): Promise<Action | null> {
    try {
      const { data: action, errors } = await client.models.Action.get({ id: id });

      if (errors) {
        throw this.serviceError(errors, 'findAction');
      }

      return action;
    } catch (error) {
      throw this.serviceError(error, 'findAction');
    }
  }

  async getAction(id: string): Promise<Action> {
    const action = await this.findAction(id);
    if (!action) {
      throw new Error('Action not found');
    }
    return action;
  }


  // async logAction(model: any, type: ActionType): Promise<Action> {
  //   try {
  //     const { data: newAction, errors } = await client.models.Action.create({
  //       description: `Service call ${type} for ${type}`,
  //       modelName: typeof model,
  //       type: type,
  //       refId: model.id,
  //       userId: userService.currentUser?.id,
  //     });

  //     if (errors) {
  //       throw this.serviceError(errors, 'createAction');
  //     }

  //     return newAction!;
  //   } catch (error) {
  //     throw this.serviceError(error, 'createAction');
  //   }
  // }


  async listActions(options: ListActionsOptions = {}): Promise<{ actions: Action[]; nextToken: string | null }> {
    try {
      const {
        data: actions,
        nextToken,
        errors
      } = await client.models.Action.list({
        limit: options.limit || 10,
        nextToken: options.nextToken,
      });

      if (errors) {
        throw this.serviceError(errors, 'listActions');
      }

      return { actions: actions as Action[], nextToken: nextToken ?? null };
    } catch (error) {
      throw this.serviceError(error, 'listActions');
    }
  }
}

export const actionService = new ActionService();