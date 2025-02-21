import { useState, useCallback } from 'react';
import { profileService, type UserProfile } from '../services/profile.service';
import { RECORDS_PER_PAGE_OPTIONS } from '../components/accounts/AccountColumns';

export function useUserPagination() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(RECORDS_PER_PAGE_OPTIONS[0]);

  const loadUsers = useCallback(async (token?: string | null) => {
    try {
      setIsLoading(true);
      const { profiles: fetchedUsers, nextToken: newNextToken } =
        await profileService.listProfiles({
          limit: recordsPerPage,
          nextToken: token ?? null,
        });

      setUsers(fetchedUsers);
      setNextToken(newNextToken);
      setTotalPages(newNextToken ? currentPage + 1 : currentPage);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [recordsPerPage, currentPage]);

  const handleNextPage = useCallback(() => {
    if (nextToken) {
      setPrevTokens([...prevTokens, nextToken]);
      setCurrentPage(currentPage + 1);
      loadUsers(nextToken);
    }
  }, [nextToken, prevTokens, currentPage, loadUsers]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      const newPrevTokens = [...prevTokens];
      const prevToken = newPrevTokens.pop();
      setPrevTokens(newPrevTokens);
      setCurrentPage(currentPage - 1);
      loadUsers(prevToken);
    }
  }, [currentPage, prevTokens, loadUsers]);

  const handleRecordsPerPageChange = useCallback((newValue: number) => {
    setRecordsPerPage(newValue);
    setCurrentPage(1);
    setNextToken(null);
    setPrevTokens([]);
    loadUsers(null);
  }, [loadUsers]);

  return {
    users,
    currentPage,
    totalPages,
    isLoading,
    recordsPerPage,
    loadUsers,
    handleNextPage,
    handlePrevPage,
    handleRecordsPerPageChange,
  };
}