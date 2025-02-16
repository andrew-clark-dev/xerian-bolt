import type { Sale } from '../../services/sale.service';
import { formatPrice } from '../../utils/format';

export const RECORDS_PER_PAGE_OPTIONS = [10, 30, 100] as const;

export const columns = [
  { key: 'number' as keyof Sale, label: 'Number', sortable: true },
  { key: 'total' as keyof Sale, label: 'Total', sortable: true },
  { key: 'tax' as keyof Sale, label: 'Tax', sortable: true },
  { key: 'transaction' as keyof Sale, label: 'Transaction', sortable: true },
  { key: 'status' as keyof Sale, label: 'Status', sortable: true },
];

export const getStatusColor = (status: Sale['status'], refund: number) => {
  if (refund > 0) {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  }

  const colors = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Finalized: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Parked: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Voided: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  };
  return colors[status] || colors.Pending;
};

export { formatPrice };