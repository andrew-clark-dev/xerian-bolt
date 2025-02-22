import { GraphQLFormattedError } from 'graphql';

class ServiceError extends Error {
  constructor(message: string, public readonly errors?: GraphQLFormattedError[]) {
    super(message);
    this.name = 'ServiceError';
  }
}

export function errorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof ServiceError) {
    return error.message;
  }
  return defaultMessage;
}

export function createServiceError(error: unknown, context: string): Error {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Error in ${context}:`, error);
  return new Error(`${context}: ${message}`);
}


export function logError(error: unknown): unknown {
  if (error instanceof ServiceError) {
    console.error(`ServiceError in ${callerName()} - ${error.message}`);
  } else if (error instanceof Error) {
    console.error(`Error in ${callerName()} - ${error.message}`);
  } else {
    console.error(`Error in ${callerName()}`, error);
  }
  return error;
}

export function logAndRethow(error: unknown) {
  throw logError(error);
}

export function checkedValue(object: unknown, errors?: GraphQLFormattedError[]): object {
  checkErrors(errors);
  checkNotFound(object);
  return object!;
}

export function checkErrors(errors?: GraphQLFormattedError[]): void {
  if (errors) {
    for (const err of errors) {
      console.error(`Error ${err.message} in ${callerName()} : `, err);
    }
    throw new ServiceError('Amplify api errors occurred', errors);
  }

}

type Reponse = { data: unknown, errors?: GraphQLFormattedError[] };

export function checkedResponse(response: Reponse | null): unknown {
  if (!response) {
    throw new ServiceError('No response');
  }
  if (response.errors) {
    for (const err of response.errors) {
      console.error(`Error ${err.message} in ${callerName()} : `, err);
    }
    throw new ServiceError('Amplify api errors occurred', response.errors);
  } else {
    return response.data;
  }

}

export async function checkedFutureResponse(response: Promise<Reponse> | null): Promise<unknown> {
  return checkedResponse(await response);
}

export async function checkedNotNullFutureResponse(response: Promise<Reponse>): Promise<unknown> {
  return checkNotFound(await checkedFutureResponse(response));
}


export function checkNotFound(object: unknown): object {
  if (!object) {
    throw new ServiceError('Not found');
  } else {
    if (object instanceof Array && object.length === 0) {
      throw new ServiceError('Not found');
    }
    return object;
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
