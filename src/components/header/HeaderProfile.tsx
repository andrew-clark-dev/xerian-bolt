import { User, LogOut } from 'lucide-react';

interface HeaderProfileProps {
    username?: string;
    onSignOut?: () => void;
}

export function HeaderProfile({ username, onSignOut }: HeaderProfileProps) {
    return (
        <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <User className="w-6 h-6" />
                <span className="text-gray-900 dark:text-white">{username}</span>
            </button>

            <button
                onClick={onSignOut}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title="Sign Out"
            >
                <LogOut className="w-6 h-6" />
            </button>
        </div>
    );
}