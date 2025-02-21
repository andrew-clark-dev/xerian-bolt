import { useEffect } from 'react';
import { SalesHeader } from '../components/sales/SalesHeader';
import { SaleList } from '../components/sales/SaleList';
import { useSalePagination } from '../hooks/useSalePagination';
import { useSaleSort } from '../hooks/useSaleSort';

export function Sales() {
  const { sortColumn, sortDirection, handleSort } = useSaleSort();
  const {
    sales,
    currentPage,
    totalPages,
    isLoading,
    recordsPerPage,
    loadSales,
    handleNextPage,
    handlePrevPage,
    handleRecordsPerPageChange,
  } = useSalePagination();

  useEffect(() => {
    loadSales();
  }, [sortColumn, sortDirection, recordsPerPage, loadSales]);

  return (
    <div className="space-y-6">
      <SalesHeader />

      <SaleList
        sales={sales}
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