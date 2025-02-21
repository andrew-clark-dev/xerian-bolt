import { useEffect, useState } from 'react';
import { AccountsHeader } from '../components/accounts/AccountsHeader';
import { AccountTable } from '../components/accounts/AccountTable';
import { AccountPagination } from '../components/accounts/AccountPagination';
import { useAccountPagination } from '../hooks/useAccountPagination';
import { useAccountSort } from '../hooks/useAccountSort';
import { ImportDialog } from '../components/imports/ImportDialog';
import { AccountForm } from '../components/accounts/AccountForm';
import { accountService, type Account } from '../services/account.service';

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

  const [showImportDialog, setShowImportDialog] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, [sortColumn, sortDirection, recordsPerPage, loadAccounts]);

  return (
    <div className="space-y-6">
      <AccountsHeader onImportClick={() => setShowImportDialog(true)} />
      
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

      <ImportDialog<Account>
        isOpen={showImportDialog}
        title="Import Account"
        onClose={() => setShowImportDialog(false)}
        onImport={accountService.findFirstExternalAccount}
        onSave={async (account) => {
          await accountService.createAccount(account);
          loadAccounts();
        }}
        renderForm={(data, onChange) => (
          <AccountForm
            formData={data}
            isLoading={false}
            onChange={onChange}
          />
        )}
      />
    </div>
  );
}