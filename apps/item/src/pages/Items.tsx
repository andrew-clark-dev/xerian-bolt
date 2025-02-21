import { useEffect, useState } from 'react';
import { ItemsHeader } from '../components/items/ItemsHeader';
import { ItemList } from '../components/items/ItemList';
import { useItemPagination } from '../hooks/useItemPagination';
import { useItemSort } from '../hooks/useItemSort';
import { Search } from 'lucide-react';
import { theme } from '../theme';
import { type Item } from '../services/item.service';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  useEffect(() => {
    loadItems();
  }, [sortColumn, sortDirection, recordsPerPage, loadItems]);

  useEffect(() => {
    // Filter items based on search query
    const query = searchQuery.toLowerCase();
    const filtered = items.filter(item =>
      item.sku.toLowerCase().includes(query) ||
      (item.title?.toLowerCase() || '').includes(query) ||
      (item.category?.toLowerCase() || '').includes(query) ||
      (item.brand?.toLowerCase() || '').includes(query)
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // You could add additional search logic here if needed
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="space-y-6">
      <ItemsHeader />

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search items by SKU, title, category, or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          className={`pl-10 ${theme.component('input')} max-w-2xl`}
        />
      </div>

      <ItemList
        items={searchQuery ? filteredItems : items}
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