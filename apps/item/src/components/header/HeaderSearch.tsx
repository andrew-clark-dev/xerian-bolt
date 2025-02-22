import { Search as SearchIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { accountService } from '../../services/account.service';
import { itemService } from '../../services/item.service';
import { saleService } from '../../services/sale.service';
import { SearchResults } from '../search/SearchResults';
import { Button } from '../ui/Button';

export function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState({
    accounts: [],
    items: [],
    sales: [],
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setIsSearching(true);
    setShowResults(true);

    try {
      const [account, item, sale] = await Promise.all([
        accountService.findAccount(trimmedQuery),
        itemService.findItem(trimmedQuery),
        saleService.findSale(trimmedQuery),
      ]);

      setSearchResults({
        accounts: account ? [account] : [],
        items: item ? [item] : [],
        sales: sale ? [sale] : [],
      });
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div ref={searchContainerRef} className="relative flex-1">
      <div className="flex items-center gap-2 max-w-lg">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={!query.trim() || isSearching}
          className="flex items-center gap-2"
        >
          <SearchIcon className="w-4 h-4" />
          Search
        </Button>
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <SearchResults
            accounts={searchResults.accounts}
            items={searchResults.items}
            sales={searchResults.sales}
            isLoading={isSearching}
            onClose={() => setShowResults(false)}
          />
        </div>
      )}
    </div>
  );
}