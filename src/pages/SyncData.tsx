import { useState, useEffect } from 'react';
import { SyncDataHeader } from '../components/sync/SyncDataHeader';
import { SyncDataList } from '../components/sync/SyncDataList';
import { syncDataService, type SyncData as SyncDataType } from '../services/sync-data.service';

const RECORDS_PER_PAGE = 10;

export function SyncData() {
  const [syncData, setSyncData] = useState<SyncDataType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]);

  const loadSyncData = async (token?: string | null) => {
    try {
      setIsLoading(true);
      const { syncData: fetchedData, nextToken: newNextToken } =
        await syncDataService.listSyncData({
          limit: RECORDS_PER_PAGE,
          nextToken: token ?? null,
        });

      setSyncData(fetchedData);
      setNextToken(newNextToken);
      setTotalPages(newNextToken ? currentPage + 1 : currentPage);
    } catch (error) {
      console.error('Failed to load sync data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSyncData();
  }, []);

  const handleNextPage = () => {
    if (nextToken) {
      setPrevTokens([...prevTokens, nextToken]);
      setCurrentPage(currentPage + 1);
      loadSyncData(nextToken);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPrevTokens = [...prevTokens];
      const prevToken = newPrevTokens.pop();
      setPrevTokens(newPrevTokens);
      setCurrentPage(currentPage - 1);
      loadSyncData(prevToken);
    }
  };

  return (
    <div className="space-y-6">
      <SyncDataHeader />

      <SyncDataList
        syncData={syncData}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        recordsPerPage={RECORDS_PER_PAGE}
        onPageChange={(page) => {
          if (page > currentPage) {
            handleNextPage();
          } else {
            handlePrevPage();
          }
        }}
      />
    </div>
  );
}