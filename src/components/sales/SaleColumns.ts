import type { Sale } from '../../services/sale.service';

export const RECORDS_PER_PAGE_OPTIONS = [10, 30, 100] as const;

export const columns = [
  { key: 'number' as keyof Sale, label: 'Number', sortable: true },
  { key: 'customerEmail' as keyof Sale, label: 'Customer', sortable: true },
  { key: 'status' as keyof Sale, label: 'Status', sortable: true },
  { key: 'total' as keyof Sale, label: 'Total', sortable: true },
  { key: 'accountTotal' as keyof Sale, label: 'Account Total', sortable: true },
  { key: 'storeTotal' as keyof Sale, label: 'Store Total', sortable: true },
  { key: 'createdAt' as keyof Sale, label: 'Created At', sortable: true },
];

export const getStatusColor = (status: Sale['status']) => {
  const colors = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Finalized: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Parked: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Voided: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return colors[status] || colors.Pending;
};

export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(amount / 100);
};