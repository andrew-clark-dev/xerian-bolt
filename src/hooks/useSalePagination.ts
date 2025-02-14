import { useState, useCallback } from 'react';
import { saleService, type Sale } from '../services/sale.service';
import { RECORDS_PER_PAGE_OPTIONS } from '../components/sales/SaleColumns';

export function useSalePagination() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(RECORDS_PER_PAGE_OPTIONS[0]);

  const loadSales = useCallback(async (token?: string | null) => {
    try {
      setIsLoading(true);
      const { sales: fetchedSales, nextToken: newNextToken } = 
        await saleService.listSales({
          limit: recordsPerPage,
          nextToken: token ?? null,
        });
      
      setSales(fetchedSales);
      setNextToken(newNextToken);
      setTotalPages(newNextToken ? currentPage + 1 : currentPage);
    } catch (error) {
      console.error('Failed to load sales:', error);
    } finally {
      setIsLoading(false);
    }
  }, [recordsPerPage, currentPage]);

  const handleNextPage = useCallback(() => {
    if (nextToken) {
      setPrevTokens([...prevTokens, nextToken]);
      setCurrentPage(currentPage + 1);
      loadSales(nextToken);
    }
  }, [nextToken, prevTokens, currentPage, loadSales]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      const newPrevTokens = [...prevTokens];
      const prevToken = newPrevTokens.pop();
      setPrevTokens(newPrevTokens);
      setCurrentPage(currentPage - 1);
      loadSales(prevToken);
    }
  }, [currentPage, prevTokens, loadSales]);

  const handleRecordsPerPageChange = useCallback((newValue: number) => {
    setRecordsPerPage(newValue);
    setCurrentPage(1);
    setNextToken(null);
    setPrevTokens([]);
    loadSales(null);
  }, [loadSales]);

  return {
    sales,
    currentPage,
    totalPages,
    isLoading,
    recordsPerPage,
    loadSales,
    handleNextPage,
    handlePrevPage,
    handleRecordsPerPageChange,
  };
}