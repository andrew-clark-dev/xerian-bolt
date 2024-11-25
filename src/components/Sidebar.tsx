import { Home, LayoutDashboard, Settings, Users, FileSpreadsheet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Accounts', href: '/accounts', icon: FileSpreadsheet },
    { name: 'Profile', href: '/profile', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 w-64 text-white">
      <div className="p-4 flex items-center gap-2 border-b border-gray-800">
        <Home className="w-6 h-6" />
        <span className="text-xl font-bold">Dashboard</span>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}