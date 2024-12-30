export function createServiceError(error: unknown, context: string): Error {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Error in ${context}:`, error);
  return new Error(`${context}: ${message}`);
}