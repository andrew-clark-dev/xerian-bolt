import { RefreshCw } from 'lucide-react';

export function SyncDataHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <RefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Sync Status</h1>
      </div>
    </div>
  );
}