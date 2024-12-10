
import type { ExternalUser } from '../types';
import type { UserUpdate } from '../../../user.service';
import { initialSettings } from '../../../settings.service';


/**
 * Maps an external user to our internal User type
 */
export function mapExternalUser(external: ExternalUser): UserUpdate {

  return {
    username: external.name,
    email: `${external.name}@xerian.com`,
    status: 'Pending',
    role: 'Employee',
    settings: initialSettings,

    // Add other missing properties with default values if necessary
  };
}