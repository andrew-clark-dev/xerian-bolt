import { useState, useEffect } from 'react';
import { accountService, type Account } from '../services/account.service';
import { AccountList } from '../components/accounts/AccountList';
import { AccountsHeader } from '../components/accounts/AccountsHeader';

const ITEMS_PER_PAGE = 10;

export function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof Account>('number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]);

  useEffect(() => {
    loadAccounts();
  }, [sortColumn, sortDirection]);

  const loadAccounts = async (token?: string | null) => {
    try {
      setIsLoading(true);
      const { accounts: fetchedAccounts, nextToken: newNextToken } = await accountService.listAccounts({
        limit: ITEMS_PER_PAGE,
        nextToken: token,
        sort: {
          field: sortColumn,
          direction: sortDirection,
        },
      });
      
      setAccounts(fetchedAccounts);
      setNextToken(newNextToken);
      
      // Calculate total pages based on whether there's a next page
      setTotalPages(newNextToken ? currentPage + 1 : currentPage);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (nextToken) {
      setPrevTokens([...prevTokens, nextToken]);
      setCurrentPage(currentPage + 1);
      loadAccounts(nextToken);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPrevTokens = [...prevTokens];
      const prevToken = newPrevTokens.pop();
      setPrevTokens(newPrevTokens);
      setCurrentPage(currentPage - 1);
      loadAccounts(prevToken);
    }
  };

  const handleSort = (column: keyof Account) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    // Reset pagination when sorting changes
    setCurrentPage(1);
    setNextToken(null);
    setPrevTokens([]);
  };

  return (
    <div className="space-y-6">
      <AccountsHeader />
      <AccountList
        accounts={accounts}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
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