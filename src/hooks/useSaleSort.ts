import { useState } from 'react';
import type { Sale } from '../services/sale.service';

export function useSaleSort() {
  const [sortColumn, setSortColumn] = useState<keyof Sale>('number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof Sale) => {
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