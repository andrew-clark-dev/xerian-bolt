import { useEffect } from 'react';
import { SyncDataHeader } from '../components/sync/SyncDataHeader';
import { SyncDataList } from '../components/sync/SyncDataList';
import { useAccountPagination } from '../hooks/useAccountPagination';
import { useAccountSort } from '../hooks/useAccountSort';
import { syncDataService } from '../services/sync-data.service';

export function SyncData() {
  const { sortColumn, sortDirection, handleSort } = useAccountSort();
  const {
    accounts: syncData,
    currentPage,
    totalPages,
    isLoading,
    recordsPerPage,
    loadAccounts: loadSyncData,
    handleNextPage,
    handlePrevPage,
    handleRecordsPerPageChange,
  } = useAccountPagination();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { syncData } = await syncDataService.listSyncData({
          limit: recordsPerPage,
          sort: {
            field: sortColumn,
            direction: sortDirection,
          },
        });
        loadSyncData();
      } catch (error) {
        console.error('Failed to load sync data:', error);
      }
    };

    fetchData();
  }, [sortColumn, sortDirection, recordsPerPage, loadSyncData]);

  return (
    <div className="space-y-6">
      <SyncDataHeader />
      
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <SyncDataList
          syncData={syncData}
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
    </div>
  );
}