import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../../ui/Input';
import { theme } from '../../../theme';

interface ApiKeyFieldProps {
    value: string;
}

export function ApiKeyField({ value }: ApiKeyFieldProps) {
    const [showApiKey, setShowApiKey] = useState(false);

    return (
        <div>
            <label className={`block text-sm font-medium ${theme.text()} mb-1`}>
                API Key
            </label>
            <div className="relative">
                <Input
                    type={showApiKey ? "text" : "password"}
                    value={value || ''}
                    readOnly
                    className="w-full pr-10"
                    placeholder="No API key configured"
                />
                <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    {showApiKey ? (
                        <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                        <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    )}
                </button>
            </div>
        </div>
    );
}