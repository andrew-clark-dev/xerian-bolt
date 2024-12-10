import { TableHeader } from '../ui/table/TableHeader';
import { Pagination } from '../ui/table/Pagination';
import { Account } from '../../services/account.service';
import { useNavigate } from 'react-router-dom';

interface AccountListProps {
  accounts: Account[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  sortColumn: keyof Account;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof Account) => void;
  onPageChange: (page: number) => void;
}

const columns = [
  { key: 'number' as keyof Account, label: 'Number', sortable: true },
  { key: 'name' as keyof Account, label: 'Name', sortable: true },
  { key: 'status' as keyof Account, label: 'Status', sortable: true },
  { key: 'updatedAt' as keyof Account, label: 'Last Updated', sortable: true },
];

const getStatusColor = (status: Account['status']) => {
  const colors = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Suspended: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  };
  return colors[status] || colors.Inactive;
};

export function AccountList({
  accounts,
  isLoading,
  currentPage,
  totalPages,
  sortColumn,
  sortDirection,
  onSort,
  onPageChange,
}: AccountListProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
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
                    {new Date(account.updatedAt).toLocaleDateString()}
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