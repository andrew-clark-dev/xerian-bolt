import { GraphQLFormattedError } from 'graphql';

class ServiceError extends Error {
  constructor(message: string, public readonly errors?: GraphQLFormattedError[]) {
    super(message);
    this.name = 'ServiceError';
  }
}

export function createServiceError(error: unknown, context: string): Error {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Error in ${context}:`, error);
  return new Error(`${context}: ${message}`);
}

export function logAndRethow(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Error in ${callerName()} - ${message}`);
  throw error;
}

export function logError(error: unknown): unknown {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Error in ${callerName()} - ${message}`);
  return error;
}


export function checkErrors(errors?: GraphQLFormattedError[]): void {
  if (errors) {
    for (const err of errors) {
      console.error(`Error ${err.message} in ${callerName()} : `, err);
    }
    throw new ServiceError('Amplify api errors occurred', errors);
  }

}


/**
 * @description Get invoker name
 * @return {string} The invoker name
 */
function callerName(): string {
  const stack = new Error().stack;
  if (stack) {
    return stack.split('at ')[3].split(' ')[0];
  }
  return 'unknown';
}
