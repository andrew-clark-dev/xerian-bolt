import { useState, useMemo } from 'react';
import { TableHeader } from '../components/Table/TableHeader';
import { Pagination } from '../components/Table/Pagination';
import { FileSpreadsheet, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Account {
  id: number;
  number: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  lastUpdated: string;
}

const ITEMS_PER_PAGE = 10;

// Sample data
export const accounts: Account[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  number: `ACC-${String(i + 1).padStart(5, '0')}`,
  name: `Account ${i + 1}`,
  status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as Account['status'],
  lastUpdated: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
}));

const columns = [
  { key: 'number' as keyof Account, label: 'Number', sortable: true },
  { key: 'name' as keyof Account, label: 'Name', sortable: true },
  { key: 'status' as keyof Account, label: 'Status', sortable: true },
  { key: 'lastUpdated' as keyof Account, label: 'Last Updated', sortable: true },
];

export function Accounts() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof Account>('number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('asc');

  const handleSort = (column: keyof Account) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedAccounts = useMemo(() => {
    if (!sortColumn || !sortDirection) return accounts;

    return [...accounts].sort((a, b) => {
      if (sortColumn === 'lastUpdated') {
        return sortDirection === 'asc'
          ? new Date(a[sortColumn]).getTime() - new Date(b[sortColumn]).getTime()
          : new Date(b[sortColumn]).getTime() - new Date(a[sortColumn]).getTime();
      }

      return sortDirection === 'asc'
        ? String(a[sortColumn]).localeCompare(String(b[sortColumn]))
        : String(b[sortColumn]).localeCompare(String(a[sortColumn]));
    });
  }, [sortColumn, sortDirection]);

  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAccounts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, sortedAccounts]);

  const totalPages = Math.ceil(accounts.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
        </div>
        <Link
          to="/accounts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Account
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAccounts.map((account) => (
                <tr
                  key={account.id}
                  onClick={() => navigate(`/accounts/${account.number}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {account.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        account.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : account.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {account.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(account.lastUpdated).toLocaleDateString()}
                  </td>
                </tr>
              ))}
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