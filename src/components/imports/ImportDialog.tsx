import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { theme } from '../../theme';
import { Button } from '../ui/Button';

interface ImportDialogProps<T> {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onImport: (query: string) => Promise<T | null>;
  onSave: (data: T) => Promise<void>;
  renderForm: (data: Partial<T>, onChange: (field: keyof T, value: unknown) => void) => React.ReactNode;
}

export function ImportDialog<T>({
  isOpen,
  title,
  onClose,
  onImport,
  onSave,
  renderForm,
}: ImportDialogProps<T>) {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Partial<T>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!query) return;

    setError('');
    setIsLoading(true);

    try {
      const result = await onImport(query);
      if (result) {
        setData(result);
      } else {
        setError('No results found');
      }
    } catch (error) {
      console.error('Import search failed:', error);
      setError('Failed to search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSave(data as T);
      onClose();
    } catch (error) {
      console.error('Import failed:', error);
      setError('Failed to import. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: keyof T, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-lg font-semibold ${theme.text()}`}>{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter search query..."
                className={theme.component('input')}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!query || isLoading}
              className="inline-flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/50 dark:text-red-400 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderForm(data, handleFieldChange)}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || Object.keys(data).length === 0}
              >
                {isLoading ? 'Importing...' : 'Import'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}