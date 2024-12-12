import { useState, useCallback } from 'react';
import { accountService, type Account } from '../services/account.service';
import { RECORDS_PER_PAGE_OPTIONS } from '../components/accounts/AccountColumns';

export function useAccountPagination() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(RECORDS_PER_PAGE_OPTIONS[0]);

  const loadAccounts = useCallback(async (token?: string | null) => {
    try {
      setIsLoading(true);
      const { accounts: fetchedAccounts, nextToken: newNextToken } = 
        await accountService.listAccounts({
          limit: recordsPerPage,
          nextToken: token ?? null,
        });
      
      setAccounts(fetchedAccounts);
      setNextToken(newNextToken);
      setTotalPages(newNextToken ? currentPage + 1 : currentPage);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [recordsPerPage, currentPage]);

  const handleNextPage = useCallback(() => {
    if (nextToken) {
      setPrevTokens([...prevTokens, nextToken]);
      setCurrentPage(currentPage + 1);
      loadAccounts(nextToken);
    }
  }, [nextToken, prevTokens, currentPage, loadAccounts]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      const newPrevTokens = [...prevTokens];
      const prevToken = newPrevTokens.pop();
      setPrevTokens(newPrevTokens);
      setCurrentPage(currentPage - 1);
      loadAccounts(prevToken);
    }
  }, [currentPage, prevTokens, loadAccounts]);

  const handleRecordsPerPageChange = useCallback((newValue: number) => {
    setRecordsPerPage(newValue);
    setCurrentPage(1);
    setNextToken(null);
    setPrevTokens([]);
    loadAccounts(null);
  }, [loadAccounts]);

  return {
    accounts,
    currentPage,
    totalPages,
    isLoading,
    recordsPerPage,
    loadAccounts,
    handleNextPage,
    handlePrevPage,
    handleRecordsPerPageChange,
  };
}