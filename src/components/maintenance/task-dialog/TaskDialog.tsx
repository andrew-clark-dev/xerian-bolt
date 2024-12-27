import { useState } from 'react';
import { X, Play } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { theme } from '../../../theme';
import { TaskConfig } from '../../../services/tasks/types';
import { ApiKeyField } from './ApiKeyField';
import { DateRangeFields } from './DateRangeFields';
import { taskTypes } from './TaskTypes';
import { scheduleTypes } from './ScheduleTypes';
import { DateRange } from '../../../services/import/types';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskConfig) => void;
  apiKey?: string;
}

export function TaskDialog({ isOpen, onClose, onSubmit, apiKey }: TaskDialogProps) {
  const [config, setConfig] = useState<TaskConfig>({
    name: taskTypes[0].name,
    modelType: taskTypes[0].modelType,
    schedule: 'now',
    retentionDays: 30,
    notifyOnComplete: false,
    dateRange: {
      from: new Date(),
      to: new Date(),
    },
  });

  if (!isOpen) return null;

  const selectedTask = taskTypes.find(t => t.name === config.name);
  const requiresApiKey = selectedTask?.requiresApiKey ?? false;
  const showApiKeyWarning = requiresApiKey && !apiKey;
  const isImportTask = config.name.startsWith('Import');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`max-w-md w-full mx-4 ${theme.surface()} rounded-lg shadow-xl`}>
        <div className={`flex items-center justify-between p-4 ${theme.border()} border-b`}>
          <h2 className={`text-lg font-semibold ${theme.text()}`}>Configure Task</h2>
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
              Task Type
            </label>
            <select
              value={config.name}
              onChange={(e) => {
                const task = taskTypes.find(t => t.name === e.target.value);
                if (task) {
                  setConfig({
                    ...config,
                    name: task.name,
                    modelType: task.modelType,
                  });
                }
              }}
              className={`w-full px-3 py-2 ${theme.border()} border rounded-lg ${theme.surface('secondary')} ${theme.text()}`}
              required
            >
              {taskTypes.map((task) => (
                <option key={task.name} value={task.name}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>

          {requiresApiKey && <ApiKeyField value={apiKey || ''} />}

          {isImportTask && (
            <div>
              <label className={`block text-sm font-medium ${theme.text()} mb-1`}>
                Date Range
              </label>
              <DateRangeFields
                value={config.dateRange as DateRange}
                onChange={(dateRange) => setConfig({ ...config, dateRange })}
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

          {showApiKeyWarning && (
            <div className={`p-4 ${theme.status('error')} rounded-lg`}>
              <p className="text-sm font-medium">API Key Required</p>
              <p className="text-sm mt-1">
                Please set up your API key in Settings before importing data.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={requiresApiKey && !apiKey}
              className="inline-flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}