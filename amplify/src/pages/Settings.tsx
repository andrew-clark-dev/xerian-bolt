import { useState, useEffect } from 'react';
import { Bell, Moon, Sun, Key } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { settingsService } from '../services/settings';
import { Input } from '../components/ui/Input';

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await settingsService.getSettings();
      setNotifications(settings.notifications);
      setApiKey(settings.apiKey || '');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleApiKeyChange = async (value: string) => {
    setApiKey(value);
    setApiKeyStatus('saving');

    try {
      await settingsService.updateApiKey(value);
      setApiKeyStatus('success');
      setTimeout(() => setApiKeyStatus('idle'), 2000);
    } catch (error) {
      setApiKeyStatus('error');
      setTimeout(() => setApiKeyStatus('idle'), 2000);
    }
  };

  const handleNotificationsChange = async (checked: boolean) => {
    try {
      await settingsService.updateSettings({ notifications: checked });
      setNotifications(checked);
    } catch (error) {
      console.error('Failed to update notifications setting:', error);
    }
  };

  const getApiKeyStatusColor = () => {
    switch (apiKeyStatus) {
      case 'saving':
        return 'text-blue-600 dark:text-blue-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-transparent';
    }
  };

  const getApiKeyStatusText = () => {
    switch (apiKeyStatus) {
      case 'saving':
        return 'Saving...';
      case 'success':
        return 'Saved';
      case 'error':
        return 'Failed to save';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">API Key</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your API key for external integrations</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 relative">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="Enter your API key"
              className="max-w-md pr-20"
            />
            <span 
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${getApiKeyStatusColor()}`}
            >
              {getApiKeyStatusText()}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your notification preferences</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications}
                onChange={(e) => handleNotificationsChange(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark mode theme</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}