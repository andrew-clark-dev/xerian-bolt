import type { Account } from '../../services/account.service';

export const RECORDS_PER_PAGE_OPTIONS = [10, 30, 100] as const;

export const columns = [
  { key: 'number' as keyof Account, label: 'Number', sortable: true },
  { key: 'name' as keyof Account, label: 'Name', sortable: true },
  { key: 'email' as keyof Account, label: 'Email', sortable: true },
  { key: 'phoneNumber' as keyof Account, label: 'Phone', sortable: true },
  { key: 'status' as keyof Account, label: 'Status', sortable: true },
  { key: 'kind' as keyof Account, label: 'Type', sortable: true },
  { key: 'balance' as keyof Account, label: 'Balance', sortable: true },
];

export const getStatusColor = (status: Account['status']) => {
  const colors = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Suspended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  };
  return colors[status] || colors.Inactive;
};

export const getKindColor = (kind: Account['kind']) => {
  const colors = {
    Standard: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    VIP: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Vender: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    Employee: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  };
  return colors[kind] || colors.Standard;
};

export const formatBalance = (balance: number): string => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(balance / 100);
};