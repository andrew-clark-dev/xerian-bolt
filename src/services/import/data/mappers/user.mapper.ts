import type { UserProfileCreate } from '../../../profile.service';
import type { ExternalUser } from '../../types';

export function mapExternalUser(external: ExternalUser): UserProfileCreate {
  return {
    nickname: external.name,
    email: `${external.id}@xerian.com`,
    status: 'Pending',
    role: 'Employee'
  };
}