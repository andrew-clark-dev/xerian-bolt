import type { Item } from '../../services/item.service';

export const RECORDS_PER_PAGE_OPTIONS = [10, 30, 100] as const;

export const columns = [
  { key: 'sku' as keyof Item, label: 'SKU', sortable: true },
  { key: 'title' as keyof Item, label: 'Title', sortable: true },
  { key: 'category' as keyof Item, label: 'Category', sortable: true },
  { key: 'brand' as keyof Item, label: 'Brand', sortable: true },
  { key: 'price' as keyof Item, label: 'Price', sortable: true },
  { key: 'status' as keyof Item, label: 'Status', sortable: true },
  { key: 'quantity' as keyof Item, label: 'Quantity', sortable: true },
];

export const getStatusColor = (status: Item['status']) => {
  const colors = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Tagged: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    HungOut: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Sold: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    ToDonate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Donated: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    Parked: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    Returned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Lost: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Stolen: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  };
  return colors[status] || colors.Unknown;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price / 100);
};