import { useEffect, useState } from 'react';
import { ItemsHeader } from '../components/items/ItemsHeader';
import { ItemList } from '../components/items/ItemList';
import { useItemPagination } from '../hooks/useItemPagination';
import { useItemSort } from '../hooks/useItemSort';
import { ImportDialog } from '../components/imports/ImportDialog';
import { ItemForm } from '../components/items/ItemForm';
import { itemService, type Item } from '../services/item.service';

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

  const [showImportDialog, setShowImportDialog] = useState(false);

  useEffect(() => {
    loadItems();
  }, [sortColumn, sortDirection, recordsPerPage, loadItems]);

  return (
    <div className="space-y-6">
      <ItemsHeader onImportClick={() => setShowImportDialog(true)} />

      <ItemList
        items={items}
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

      <ImportDialog<Item>
        isOpen={showImportDialog}
        title="Import Item"
        onClose={() => setShowImportDialog(false)}
        onImport={itemService.findFirstExternalItem}
        onSave={async (item) => {
          await itemService.createItem(item);
          loadItems();
        }}
        renderForm={(data, onChange) => (
          <ItemForm
            formData={data}
            isLoading={false}
            onChange={onChange}
          />
        )}
      />
    </div>
  );
}