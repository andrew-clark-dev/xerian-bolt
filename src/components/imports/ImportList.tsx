import { useNavigate } from 'react-router-dom';
import { ImportedObject } from '../../services/import/imported-object.service';
import { Pagination } from '../ui/table/Pagination';
import { RECORDS_PER_PAGE_OPTIONS } from '../accounts/AccountColumns';
import { columns } from './columns';

interface ImportListProps {
  imports: ImportedObject[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onRecordsPerPageChange: (value: number) => void;
}

export function ImportList({
  imports,
  isLoading,
  currentPage,
  totalPages,
  recordsPerPage,
  onPageChange,
  onRecordsPerPageChange,
}: ImportListProps) {
  const navigate = useNavigate();

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr key="loading">
          <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            Loading...
          </td>
        </tr>
      );
    }

    if (imports.length === 0) {
      return (
        <tr key="empty">
          <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            No imported objects found
          </td>
        </tr>
      );
    }

    return imports.map((importObj) => (
      <tr
        key={`${importObj.externalId}-${importObj.type}`}
        onClick={() => navigate(`/imports/${importObj.externalId}`)}
        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
          {importObj.externalId}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {importObj.type}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {importObj.userId}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
          {new Date(importObj.createdAt).toLocaleString()}
        </td>
      </tr>
    ));
  };

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
            {renderTableBody()}
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