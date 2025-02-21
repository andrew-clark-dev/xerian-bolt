import { GraphQLFormattedError } from 'graphql';

class ServiceError extends Error {
  constructor(message: string, public readonly errors?: GraphQLFormattedError[]) {
    super(message);
    this.name = 'ServiceError';
  }
}

export function checkErrors(errors?: GraphQLFormattedError[]): void {
  if (errors) {
    throw new ServiceError('API errors occurred', errors);
  }
}

type Response = { data: unknown, errors?: GraphQLFormattedError[] };

export function checkedResponse(response: Response): unknown {
  if (response.errors) {
    throw new ServiceError('API errors occurred', response.errors);
  }
  return response.data;
}

export async function checkedFutureResponse(response: Promise<Response>): Promise<unknown> {
  return checkedResponse(await response);
}

export async function checkedNotNullFutureResponse(response: Promise<Response>): Promise<unknown> {
  const result = await checkedFutureResponse(response);
  if (!result) {
    throw new ServiceError('Not found');
  }
  return result;
}