import { useState, useEffect } from 'react';
import { ImportsHeader } from '../components/imports/ImportsHeader';
import { ImportList } from '../components/imports/ImportList';
import { ImportFilter, ImportType } from '../components/imports/ImportFilter';
import { importedObjectService, ImportedObject } from '../services/import/imported-object.service';
import { RECORDS_PER_PAGE_OPTIONS } from '../components/accounts/AccountColumns';

export function Imports() {
  const [imports, setImports] = useState<ImportedObject[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(RECORDS_PER_PAGE_OPTIONS[0]);

  const [selectedType, setSelectedType] = useState<ImportType | 'all'>('all');

  useEffect(() => {
    loadImports();
  }, [recordsPerPage, selectedType]);

  const loadImports = async (token?: string | null) => {
    try {
      setIsLoading(true);
      const { imports: fetchedImports, nextToken: newNextToken } =
        await importedObjectService.listImportedObjects({
          limit: recordsPerPage,
          nextToken: token ?? null,
          type: selectedType,
        });

      setImports(fetchedImports);
      setNextToken(newNextToken);
      setTotalPages(newNextToken ? currentPage + 1 : currentPage);
    } catch (error) {
      console.error('Failed to load imports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (nextToken) {
      setPrevTokens([...prevTokens, nextToken]);
      setCurrentPage(currentPage + 1);
      loadImports(nextToken);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPrevTokens = [...prevTokens];
      const prevToken = newPrevTokens.pop();
      setPrevTokens(newPrevTokens);
      setCurrentPage(currentPage - 1);
      loadImports(prevToken);
    }
  };

  const handleRecordsPerPageChange = (newValue: number) => {
    setRecordsPerPage(newValue);
    setCurrentPage(1);
    setNextToken(null);
    setPrevTokens([]);
    loadImports(null);
  };

  const handleTypeChange = (type: ImportType | 'all') => {
    setSelectedType(type);
    setCurrentPage(1);
    setNextToken(null);
    setPrevTokens([]);
  };

  return (
    <div className="space-y-6">
      <ImportsHeader />

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <ImportFilter
          selectedType={selectedType}
          onChange={handleTypeChange}
        />
      </div>

      <ImportList
        imports={imports}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        recordsPerPage={recordsPerPage}
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