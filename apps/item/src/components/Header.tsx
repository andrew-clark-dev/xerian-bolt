import { useAuthenticator } from '@aws-amplify/ui-react';
import { User, LogOut, Plus, List } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onSignOut?: () => void;
}

export function Header({ onSignOut }: HeaderProps) {
  const { username } = useAuthenticator();
  const location = useLocation();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              location.pathname === '/'
                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Item</span>
          </Link>
          
          <Link
            to="/items"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              location.pathname === '/items'
                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <List className="w-5 h-5" />
            <span className="font-medium">Items List</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-400 rounded-lg">
            <User className="w-6 h-6" />
            <span className="text-gray-900 dark:text-white">{username}</span>
          </div>

          <button
            onClick={onSignOut}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Sign Out"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}