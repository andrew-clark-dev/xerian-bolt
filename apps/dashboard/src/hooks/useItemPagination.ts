import { useState, useCallback } from 'react';
import { itemService, type Item } from '../services/item.service';
import { RECORDS_PER_PAGE_OPTIONS } from '../components/items/ItemColumns';

export function useItemPagination() {
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(RECORDS_PER_PAGE_OPTIONS[0]);

  const loadItems = useCallback(async (token?: string | null) => {
    try {
      setIsLoading(true);
      const { accounts: fetchedItems, nextToken: newNextToken } = 
        await itemService.listItems({
          limit: recordsPerPage,
          nextToken: token ?? null,
        });
      
      setItems(fetchedItems);
      setNextToken(newNextToken);
      setTotalPages(newNextToken ? currentPage + 1 : currentPage);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [recordsPerPage, currentPage]);

  const handleNextPage = useCallback(() => {
    if (nextToken) {
      setPrevTokens([...prevTokens, nextToken]);
      setCurrentPage(currentPage + 1);
      loadItems(nextToken);
    }
  }, [nextToken, prevTokens, currentPage, loadItems]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      const newPrevTokens = [...prevTokens];
      const prevToken = newPrevTokens.pop();
      setPrevTokens(newPrevTokens);
      setCurrentPage(currentPage - 1);
      loadItems(prevToken);
    }
  }, [currentPage, prevTokens, loadItems]);

  const handleRecordsPerPageChange = useCallback((newValue: number) => {
    setRecordsPerPage(newValue);
    setCurrentPage(1);
    setNextToken(null);
    setPrevTokens([]);
    loadItems(null);
  }, [loadItems]);

  return {
    items,
    currentPage,
    totalPages,
    isLoading,
    recordsPerPage,
    loadItems,
    handleNextPage,
    handlePrevPage,
    handleRecordsPerPageChange,
  };
}