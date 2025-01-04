import type { ImportedObject } from '../../services/imported-object.service';

export const columns = [
  { key: 'externalId' as keyof ImportedObject, label: 'External ID' },
  { key: 'type' as keyof ImportedObject, label: 'Type' },
  { key: 'userId' as keyof ImportedObject, label: 'User ID' },
  { key: 'createdAt' as keyof ImportedObject, label: 'Created At' },
] as const;