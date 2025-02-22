import { Database } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { TaskConfig } from '../../../services/tasks/types';
import { theme } from '../../../theme';

interface InitializeCountersFormProps {
  onStartTask: (config: TaskConfig) => void;
}

export function InitializeCountersForm({ onStartTask }: InitializeCountersFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onStartTask({
      name: 'Initialize Model Counts',
      modelType: 'Counter',
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
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className={`text-lg font-medium ${theme.text()}`}>Initialize Counters</h3>
            <p className={`text-sm ${theme.text('secondary')}`}>
              Reset and initialize all model counters
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            Start Initialization
          </Button>
        </div>
      </form>
    </Card>
  );
}