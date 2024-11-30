import { X } from 'lucide-react';
import { createContext, useContext, useState, useCallback } from 'react';

interface ErrorContextType {
  showError: (error: Error) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  const showError = useCallback((error: Error) => {
    setError(error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      {error && <ErrorDisplay error={error} onClose={clearError} />}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}

interface ErrorDisplayProps {
  error: Error;
  onClose: () => void;
}

function ErrorDisplay({ error, onClose }: ErrorDisplayProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <div className="max-w-2xl mx-auto bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg shadow-lg">
        <div className="p-4 flex items-start gap-3">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              An error occurred
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error.message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}