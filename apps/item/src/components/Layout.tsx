import { Outlet } from 'react-router-dom';
import { Header } from './Header';

interface LayoutProps {
  onSignOut?: () => void;
}

export function Layout({ onSignOut }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <Header onSignOut={onSignOut} />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}