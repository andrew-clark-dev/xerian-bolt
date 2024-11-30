import { useState, useEffect } from 'react';
import { TableHeader } from '../components/Table/TableHeader';
import { Pagination } from '../components/Table/Pagination';
import { Users as UsersIcon, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { persistenceService, type UserDAO } from '../services/persistence';

const ITEMS_PER_PAGE = 10;

const columns = [
  { key: 'username' as keyof UserDAO, label: 'Username', sortable: true },
  { key: 'email' as keyof UserDAO, label: 'Email', sortable: true },
  { key: 'phoneNumber' as keyof UserDAO, label: 'Phone Number', sortable: true },
  { key: 'status' as keyof UserDAO, label: 'Status', sortable: true },
  { key: 'role' as keyof UserDAO, label: 'Role', sortable: true },
];

const getStatusColor = (status: UserDAO['status']) => {
  const colors = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    Suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  };
  return colors[status];
};

const getRoleColor = (role: string) => {
  const colors = {
    Admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Employee: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    Service: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    None: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  };
  return colors[role] || colors.None;
};

export function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDAO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof UserDAO>('username');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [currentPage, sortColumn, sortDirection]);

  const loadUsers = async () => {
    try {
      const result = await persistenceService.getUsers({
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        sortColumn,
        sortDirection,
      });
      setUsers(result.items);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column: keyof UserDAO) => {
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
            <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h1>
        </div>
        <Link
          to="/users/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New User
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
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/users/${user.email}`)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.phoneNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                          user.role[0]
                        )}`}
                      >
                        {user.role[0]}
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
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}