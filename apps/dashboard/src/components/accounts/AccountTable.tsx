import { useNavigate } from 'react-router-dom';
import { Account } from '../../services/account.service';
import { TableHeader } from '../ui/table/TableHeader';
import { columns, getStatusColor, getKindColor, formatBalance } from './AccountColumns';

interface AccountTableProps {
  accounts: Account[];
  isLoading: boolean;
  sortColumn: keyof Account;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof Account) => void;
}

export function AccountTable({
  accounts,
  isLoading,
  sortColumn,
  sortDirection,
  onSort,
}: AccountTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No accounts found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {accounts.map((account) => (
            <tr
              key={account.id}
              onClick={() => navigate(`/accounts/${account.number}`)}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {account.number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {[account.firstName, account.lastName].filter(Boolean).join(' ')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {account.email || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {account.phoneNumber || '-'}
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
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKindColor(
                    account.kind
                  )}`}
                >
                  {account.kind}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatBalance(account.balance)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}