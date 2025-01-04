import { Home, LayoutDashboard, Settings, Users, FileSpreadsheet, Wrench, Download, RefreshCw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Accounts', href: '/accounts', icon: FileSpreadsheet },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Imports', href: '/imports', icon: Download },
    { name: 'Sync Status', href: '/sync', icon: RefreshCw },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench },
    { name: 'Profile', href: '/profile', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64">
      <div className="p-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</span>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex-1">
            <p className="font-medium">Shop Dashboard</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}