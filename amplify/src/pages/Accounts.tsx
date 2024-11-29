import { useState, useEffect } from 'react';
import { TableHeader } from '../components/Table/TableHeader';
import { Pagination } from '../components/Table/Pagination';
import { FileSpreadsheet, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { persistenceService, type Account } from '../services/persistence';

const ITEMS_PER_PAGE = 10;

const columns = [
  { key: 'number' as keyof Account, label: 'Number', sortable: true },
  { key: 'name' as keyof Account, label: 'Name', sortable: true },
  { key: 'status' as keyof Account, label: 'Status', sortable: true },
  { key: 'lastUpdated' as keyof Account, label: 'Last Updated', sortable: true },
];

const getStatusColor = (status: Account['status']) => {
  const colors = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Suspended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  };
  return colors[status];
};

export function Accounts() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof Account>('number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, [currentPage, sortColumn, sortDirection]);

  const loadAccounts = async () => {
    try {
      const result = await persistenceService.getAccounts({
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        sortColumn,
        sortDirection,
      });
      setAccounts(result.items);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column: keyof Account) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <FileSpreadsheet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Accounts</h1>
        </div>
        <Link
          to="/accounts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Account
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <TableHeader
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No accounts found
                  </td>
                </tr>
              ) : (
                accounts.map((account) => (
                  <tr
                    key={account.id}
                    onClick={() => navigate(`/accounts/${account.number}`)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {account.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {account.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          account.status
                        )}`}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(account.lastUpdated).toLocaleDateString()}
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
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}