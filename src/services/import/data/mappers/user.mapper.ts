import type { UserUpdate } from '../../../user.service';
import type { ExternalUser } from '../types';
import { initialSettings } from '../../../settings.service';

export function mapExternalUser(external: ExternalUser): UserUpdate {
  return {
    username: external.name,
    email: `${external.name}@xerian.com`,
    status: 'Active',
    role: 'Employee',
    settings: JSON.stringify(initialSettings),
  };
}