import { useEffect } from 'react';
import { UsersHeader } from '../components/users/UsersHeader';
import { UserList } from '../components/users/UserList';
import { useUserPagination } from '../hooks/useUserPagination';
import { useUserSort } from '../hooks/useUserSort';

export function Users() {
  const { sortColumn, sortDirection, handleSort } = useUserSort();
  const {
    users,
    currentPage,
    totalPages,
    isLoading,
    recordsPerPage,
    loadUsers,
    handleNextPage,
    handlePrevPage,
    handleRecordsPerPageChange,
  } = useUserPagination();

  useEffect(() => {
    loadUsers();
  }, [sortColumn, sortDirection, recordsPerPage, loadUsers]);

  return (
    <div className="space-y-6">
      <UsersHeader />

      <UserList
        users={users}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        recordsPerPage={recordsPerPage}
        onSort={handleSort}
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
  );
}