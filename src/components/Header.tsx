import { useAuthenticator } from '@aws-amplify/ui-react';
import { HeaderSearch } from './header/HeaderSearch';
import { HeaderNotifications } from './header/HeaderNotifications';
import { HeaderProfile } from './header/HeaderProfile';

interface HeaderProps {
  onSignOut?: () => void;
}

export function Header({ onSignOut }: HeaderProps) {
  const { user } = useAuthenticator();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <HeaderSearch />

        <div className="flex items-center gap-4">
          <HeaderNotifications />
          <HeaderProfile username={user?.username} onSignOut={onSignOut} />
        </div>
      </div>
    </header>
  );
}