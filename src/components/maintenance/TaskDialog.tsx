import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { theme } from '../../theme';
import { TaskConfig, ModelType } from '../../services/tasks/types';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskConfig) => void;
  apiKey?: string;
}

const scheduleTypes = [
  { value: 'now', label: 'Run Now' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const modelTypes: ModelType[] = ['Account'];

export function TaskDialog({ isOpen, onClose, onSubmit, apiKey }: TaskDialogProps) {
  const [config, setConfig] = useState<TaskConfig>({
    name: 'Import Accounts',
    modelType: 'Account',
    schedule: 'now',
    retentionDays: 30,
    notifyOnComplete: true,
  });
  const [showApiKey, setShowApiKey] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
    onClose();
  };

  const showApiKeyWarning = !apiKey;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`max-w-md w-full mx-4 ${theme.surface()} rounded-lg shadow-xl`}>
        <div className={`flex items-center justify-between p-4 ${theme.border()} border-b`}>
          <h2 className={`text-lg font-semibold ${theme.text()}`}>Configure Import Task</h2>
          <button
            onClick={onClose}
            className={`p-1 hover:${theme.surface('secondary')} rounded-full transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className={`block text-sm font-medium ${theme.text()} mb-1`}>
              API Key
            </label>
            <div className="relative">
              <Input
                type={showApiKey ? "text" : "password"}
                value={apiKey || ''}
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

          <div>
            <label htmlFor="modelType" className={`block text-sm font-medium ${theme.text()} mb-1`}>
              Model Type
            </label>
            <select
              id="modelType"
              value={config.modelType}
              onChange={(e) => setConfig({
                ...config,
                modelType: e.target.value as ModelType,
                name: `Import ${e.target.value}`
              })}
              className={`w-full px-3 py-2 ${theme.border()} border rounded-lg ${theme.surface('secondary')} ${theme.text()}`}
              required
            >
              {modelTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="upToDate" className={`block text-sm font-medium ${theme.text()} mb-1`}>
              Import Up To Date
            </label>
            <Input
              type="datetime-local"
              id="upToDate"
              value={config.upToDate?.toISOString().slice(0, 16) || ''}
              onChange={(e) => setConfig({
                ...config,
                upToDate: e.target.value ? new Date(e.target.value) : undefined
              })}
              className="w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="schedule" className={`block text-sm font-medium ${theme.text()} mb-1`}>
              Schedule
            </label>
            <select
              id="schedule"
              value={config.schedule}
              onChange={(e) => setConfig({ ...config, schedule: e.target.value as TaskConfig['schedule'] })}
              className={`w-full px-3 py-2 ${theme.border()} border rounded-lg ${theme.surface('secondary')} ${theme.text()}`}
              required
            >
              {scheduleTypes.map((schedule) => (
                <option key={schedule.value} value={schedule.value}>
                  {schedule.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="retention" className={`block text-sm font-medium ${theme.text()} mb-1`}>
              Retention Period (days)
            </label>
            <Input
              type="number"
              id="retention"
              value={config.retentionDays}
              onChange={(e) => setConfig({ ...config, retentionDays: parseInt(e.target.value) })}
              min="1"
              max="365"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="notify"
              checked={config.notifyOnComplete}
              onChange={(e) => setConfig({ ...config, notifyOnComplete: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notify" className={`ml-2 block text-sm ${theme.text()}`}>
              Notify when complete
            </label>
          </div>

          {showApiKeyWarning && (
            <div className={`p-4 ${theme.status('error')} rounded-lg`}>
              <p className="text-sm font-medium">API Key Required</p>
              <p className="text-sm mt-1">
                Please set up your API key in Settings before importing accounts.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={showApiKeyWarning}
            >
              Start Import
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}