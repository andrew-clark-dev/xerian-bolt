import { TaskConfig } from '../../services/tasks/types';
import { InitializeCountersForm } from './task-forms/InitializeCountersForm';
import { TruncateTableForm } from './task-forms/TruncateTableForm';

interface TaskListProps {
  onStartTask: (config: TaskConfig) => void;
}

export function TaskList({ onStartTask }: TaskListProps) {
  return (
    <div className="space-y-6">
      <InitializeCountersForm 
        onStartTask={onStartTask}
      />
      
      <TruncateTableForm 
        onStartTask={onStartTask}
      />
    </div>
  );
}