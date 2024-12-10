import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { theme } from '../../theme';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: AutomatedTaskConfig) => void;
  apiKey?: string;
}

export type ModelType = 'Account' | 'Item' | 'Sale';

export interface AutomatedTaskConfig {
  name: string;
  type: 'backup' | 'cleanup' | 'update' | 'scan' | 'import' | 'reset';
  modelType?: ModelType;
  schedule: 'now' | 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  notifyOnComplete: boolean;
  upToDate?: Date;
}

const taskTypes = [
  { value: 'backup', label: 'Database Backup' },
  { value: 'cleanup', label: 'Cache Cleanup' },
  { value: 'update', label: 'System Update' },
  { value: 'scan', label: 'Security Scan' },
  { value: 'import', label: 'Import Model' },
  { value: 'reset', label: 'Reset All Data' },
];

const modelTypes: ModelType[] = ['Account', 'Item', 'Sale'];

const scheduleTypes = [
  { value: 'now', label: 'Run Now' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export function TaskDialog({ isOpen, onClose, onSubmit, apiKey }: TaskDialogProps) {
  const [config, setConfig] = useState<AutomatedTaskConfig>({
    name: '',
    type: 'backup',
    schedule: 'now',
    retentionDays: 30,
    notifyOnComplete: true,
  });

  // Update task name when model type changes
  useEffect(() => {
    if (config.type === 'import' && config.modelType) {
      setConfig(prev => ({ ...prev, name: `Import ${config.modelType}` }));
    } else if (config.type === 'reset') {
      setConfig(prev => ({ ...prev, name: 'Reset All Data' }));
    }
  }, [config.type, config.modelType]);

  // Update task configuration when type changes
  useEffect(() => {
    if (config.type === 'import' && !config.modelType) {
      setConfig(prev => ({ ...prev, modelType: 'Account' }));
    }
  }, [config.type]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
    onClose();
  };

  const handleTypeChange = (type: AutomatedTaskConfig['type']) => {
    if (type === 'import') {
      setConfig({
        ...config,
        type,
        modelType: 'Account',
        name: 'Import Account',
      });
    } else if (type === 'reset') {
      const { modelType, upToDate, ...rest } = config;
      setConfig({
        ...rest,
        type,
        name: 'Reset All Data',
      });
    } else {
      const { modelType, upToDate, ...rest } = config;
      setConfig({
        ...rest,
        type,
        name: '',
      });
    }
  };

  const showApiKeyWarning = config.type === 'import' && config.modelType === 'Account' && !apiKey;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`max-w-md w-full mx-4 ${theme.surface()} rounded-lg shadow-xl`}>
        <div className={`flex items-center justify-between p-4 ${theme.border()} border-b`}>
          <h2 className={`text-lg font-semibold ${theme.text()}`}>Configure Automated Task</h2>
          <button
            onClick={onClose}
            className={`p-1 hover:${theme.surface('secondary')} rounded-full transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="type" className={`block text-sm font-medium ${theme.text()} mb-1`}>
              Task Type
            </label>
            <select
              id="type"
              value={config.type}
              onChange={(e) => handleTypeChange(e.target.value as AutomatedTaskConfig['type'])}
              className={`w-full px-3 py-2 ${theme.border()} border rounded-lg ${theme.surface('secondary')} ${theme.text()}`}
              required
            >
              {taskTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {config.type === 'import' && (
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
          )}

          {config.type === 'import' && config.modelType === 'Account' && (
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
          )}

          {config.type !== 'import' && config.type !== 'reset' && (
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${theme.text()} mb-1`}>
                Task Name
              </label>
              <Input
                type="text"
                id="name"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                placeholder="Enter task name"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="schedule" className={`block text-sm font-medium ${theme.text()} mb-1`}>
              Schedule
            </label>
            <select
              id="schedule"
              value={config.schedule}
              onChange={(e) => setConfig({ ...config, schedule: e.target.value as AutomatedTaskConfig['schedule'] })}
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

          {config.type === 'reset' && (
            <div className={`p-4 ${theme.status('error')} rounded-lg`}>
              <p className="text-sm font-medium">Warning: This action cannot be undone</p>
              <p className="text-sm mt-1">
                This will permanently delete all data from the system. Make sure you have a backup before proceeding.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={config.type === 'reset' ? 'danger' : 'primary'}
              disabled={showApiKeyWarning}
            >
              {config.type === 'reset' ? 'Reset All Data' : 'Start Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}