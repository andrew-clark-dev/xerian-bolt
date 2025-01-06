import type { SyncData } from '../../services/sync-data.service';

export const columns = [
  { key: 'interface' as keyof SyncData, label: 'Interface' },
  { key: 'total' as keyof SyncData, label: 'Total Records' },
  { key: 'lastSync' as keyof SyncData, label: 'Last Sync' },
];

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleString();
};