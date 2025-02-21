import { useState } from 'react';
import type { Account } from '../services/account.service';

export function useAccountSort() {
  const [sortColumn, setSortColumn] = useState<keyof Account>('number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof Account) => {
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