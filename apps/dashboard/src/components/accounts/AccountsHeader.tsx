import { FileSpreadsheet, Plus, Import } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AccountsHeaderProps {
  onImportClick: () => void;
}

export function AccountsHeader({ onImportClick }: AccountsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <FileSpreadsheet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Accounts</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onImportClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <Import className="w-5 h-5" />
          Import Account
        </button>
        <Link
          to="/accounts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Account
        </Link>
      </div>
    </div>
  );
}