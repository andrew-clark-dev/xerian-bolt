import type { Schema } from '../../../../../amplify/data/resource';
import type { ExternalUser } from '../types';

type User = Schema['User']['type'];

/**
 * Maps an external user to our internal User type
 */
export function mapExternalUser(external: ExternalUser): Omit<User, 'id'> {
  const now = new Date().toISOString();
  
  return {
    username: external.name,
    email: `${external.name}@xerian.com`,
    status: 'Provisional',
    role: 'Pending',
    settings: JSON.stringify({ hasLogin: false }),
  };
}