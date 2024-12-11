import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/Input';
import { theme } from '../../theme';

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  status: 'idle' | 'saving' | 'success' | 'error';
}

export function ApiKeyInput({ value, onChange, status }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  const getStatusColor = () => {
    switch (status) {
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

  const getStatusText = () => {
    switch (status) {
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
    <div className="mt-4 relative">
      <div className="relative">
        <Input
          type={showKey ? 'text' : 'password'}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your API key"
          className="max-w-md pr-20"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          {showKey ? (
            <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>
      <span
        className={`absolute right-3 -bottom-6 text-sm transition-colors ${getStatusColor()}`}
      >
        {getStatusText()}
      </span>
    </div>
  );
}