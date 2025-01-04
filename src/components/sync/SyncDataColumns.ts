import type { SyncData } from '../../services/sync-data.service';

export const RECORDS_PER_PAGE_OPTIONS = [10, 30, 100] as const;

export const columns = [
  { key: 'interface' as keyof SyncData, label: 'Interface', sortable: true },
  { key: 'total' as keyof SyncData, label: 'Total Records', sortable: true },
  { key: 'lastSync' as keyof SyncData, label: 'Last Sync', sortable: true },
];

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleString();
};