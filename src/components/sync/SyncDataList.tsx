import { TableHeader } from '../ui/table/TableHeader';
import { Pagination } from '../ui/table/Pagination';
import { SyncData } from '../../services/sync-data.service';
import { useNavigate } from 'react-router-dom';
import { columns, formatDate, RECORDS_PER_PAGE_OPTIONS } from './SyncDataColumns';

interface SyncDataListProps {
  syncData: SyncData[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  sortColumn: keyof SyncData;
  sortDirection: 'asc' | 'desc';
  recordsPerPage: number;
  onSort: (column: keyof SyncData) => void;
  onPageChange: (page: number) => void;
  onRecordsPerPageChange: (value: number) => void;
}

export function SyncDataList({
  syncData,
  isLoading,
  currentPage,
  totalPages,
  sortColumn,
  sortDirection,
  recordsPerPage,
  onSort,
  onPageChange,
  onRecordsPerPageChange,
}: SyncDataListProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-end gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Records per page:
          </label>
          <select
            value={recordsPerPage}
            onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            {RECORDS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader
            columns={columns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={onSort}
          />
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
                    {item.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.lastSync)}
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