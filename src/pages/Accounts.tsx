import { useEffect } from 'react';
import { AccountsHeader } from '../components/accounts/AccountsHeader';
import { AccountTable } from '../components/accounts/AccountTable';
import { AccountPagination } from '../components/accounts/AccountPagination';
import { useAccountPagination } from '../hooks/useAccountPagination';
import { useAccountSort } from '../hooks/useAccountSort';

export function Accounts() {
  const { sortColumn, sortDirection, handleSort } = useAccountSort();
  const {
    accounts,
    currentPage,
    totalPages,
    isLoading,
    recordsPerPage,
    loadAccounts,
    handleNextPage,
    handlePrevPage,
    handleRecordsPerPageChange,
  } = useAccountPagination();

  useEffect(() => {
    loadAccounts();
  }, [sortColumn, sortDirection, recordsPerPage, loadAccounts]);

  return (
    <div className="space-y-6">
      <AccountsHeader />
      
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <AccountTable
          accounts={accounts}
          isLoading={isLoading}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
        
        <AccountPagination
          currentPage={currentPage}
          totalPages={totalPages}
          recordsPerPage={recordsPerPage}
          onPageChange={(page) => {
            if (page > currentPage) {
              handleNextPage();
            } else {
              handlePrevPage();
            }
          }}
          onRecordsPerPageChange={handleRecordsPerPageChange}
        />
      </div>
    </div>
  );
}