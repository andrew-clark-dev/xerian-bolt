import { useEffect } from 'react';
import { ItemsHeader } from '../components/items/ItemsHeader';
import { ItemList } from '../components/items/ItemList';
import { useItemPagination } from '../hooks/useItemPagination';
import { useItemSort } from '../hooks/useItemSort';

export function Items() {
  const { sortColumn, sortDirection, handleSort } = useItemSort();
  const {
    items,
    currentPage,
    totalPages,
    isLoading,
    recordsPerPage,
    loadItems,
    handleNextPage,
    handlePrevPage,
    handleRecordsPerPageChange,
  } = useItemPagination();

  useEffect(() => {
    loadItems();
  }, [sortColumn, sortDirection, recordsPerPage, loadItems]);

  return (
    <div className="space-y-6">
      <ItemsHeader />

      <ItemList
        items={items}
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