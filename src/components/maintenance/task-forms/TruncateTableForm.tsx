import { Trash2 } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { TaskConfig } from '../../../services/tasks/types';
import { theme } from '../../../theme';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../amplify/data/resource';

const client = generateClient<Schema>();

interface TruncateTableFormProps {
  onStartTask: (config: TaskConfig) => void;
}

export function TruncateTableForm({ onStartTask }: TruncateTableFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const tableName = formData.get('tableName') as string;
    
    onStartTask({
      name: 'Truncate Table',
      modelType: tableName as keyof Schema,
      schedule: 'now',
      retentionDays: 30,
      notifyOnComplete: false,
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className={`text-lg font-medium ${theme.text()}`}>Truncate Table</h3>
            <p className={`text-sm ${theme.text('secondary')}`}>
              Clear all records from a table
            </p>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.text()} mb-1`}>
            Select Table
          </label>
          <select
            name="tableName"
            required
            className={`w-full px-3 py-2 ${theme.border()} border rounded-lg ${theme.surface('secondary')} ${theme.text()}`}
          >
            {Object.keys(client.models).map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="danger">
            Truncate Table
          </Button>
        </div>
      </form>
    </Card>
  );
}