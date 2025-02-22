import { useState } from 'react';
import type { Item } from '../services/item.service';

export function useItemSort() {
  const [sortColumn, setSortColumn] = useState<keyof Item>('sku');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof Item) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return {
    sortColumn,
    sortDirection,
    handleSort,
  };
}