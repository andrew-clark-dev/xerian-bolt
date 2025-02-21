import { useState } from 'react';
import type { UserProfile } from '../services/profile.service';

export function useUserSort() {
  const [sortColumn, setSortColumn] = useState<keyof UserProfile>('email');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof UserProfile) => {
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