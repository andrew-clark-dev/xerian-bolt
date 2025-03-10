import { TableHeader } from '../ui/table/TableHeader';
import { Pagination } from '../ui/table/Pagination';
import { Sale } from '../../services/sale.service';
import { useNavigate } from 'react-router-dom';
import { columns, getStatusColor, formatPrice, RECORDS_PER_PAGE_OPTIONS } from './SaleColumns';

interface SaleListProps {
  sales: Sale[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  sortColumn: keyof Sale;
  sortDirection: 'asc' | 'desc';
  recordsPerPage: number;
  onSort: (column: keyof Sale) => void;
  onPageChange: (page: number) => void;
  onRecordsPerPageChange: (value: number) => void;
}

export function SaleList({
  sales,
  isLoading,
  currentPage,
  totalPages,
  sortColumn,
  sortDirection,
  recordsPerPage,
  onSort,
  onPageChange,
  onRecordsPerPageChange,
}: SaleListProps) {
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
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No sales found
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr
                  key={sale.id}
                  onClick={() => navigate(`/sales/${sale.number}`)}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    sale.refund > 0 ? 'bg-red-50 dark:bg-red-900/20' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {sale.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatPrice(sale.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatPrice(sale.tax)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {sale.transaction}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        sale.status,
                        sale.refund
                      )}`}
                    >
                      {sale.refund > 0 ? 'Refund' : sale.status}
                    </span>
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