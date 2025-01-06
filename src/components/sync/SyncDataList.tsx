import { Pagination } from '../ui/table/Pagination';
import { SyncData } from '../../services/sync-data.service';
import { useNavigate } from 'react-router-dom';
import { columns, formatDate } from './SyncDataColumns';

interface SyncDataListProps {
  syncData: SyncData[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
}

export function SyncDataList({
  syncData,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: SyncDataListProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : syncData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No sync data found
                </td>
              </tr>
            ) : (
              syncData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/sync/${item.id}`)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.interface}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {(item.total ?? 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.lastSync ?? '')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}