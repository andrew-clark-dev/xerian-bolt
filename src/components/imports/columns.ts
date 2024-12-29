import type { ImportedObject } from '../../services/import/imported-object.service';

export const columns = [
  { key: 'externalId' as keyof ImportedObject, label: 'External ID', sortable: true },
  { key: 'type' as keyof ImportedObject, label: 'Type', sortable: true },
  { key: 'userId' as keyof ImportedObject, label: 'User ID', sortable: true },
  { key: 'createdAt' as keyof ImportedObject, label: 'Created At', sortable: true },
] as const;