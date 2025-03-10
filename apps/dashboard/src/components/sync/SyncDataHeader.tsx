import { RefreshCw, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SyncDataHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <RefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Sync Status</h1>
      </div>
      <Link
        to="/sync/new"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-5 h-5" />
        New Sync Config
      </Link>
    </div>
  );
}