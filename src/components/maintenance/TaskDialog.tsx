import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { theme } from '../../theme';
import { TaskConfig } from '../../services/tasks/types';

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

export function TaskDialog({ isOpen, onClose, onSubmit, apiKey }: TaskDialogProps) {
  const [config, setConfig] = useState<TaskConfig>({
    name: 'Import Accounts',
    schedule: 'now',
    retentionDays: 30,
    notifyOnComplete: true,
  });

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