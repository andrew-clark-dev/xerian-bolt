import { useState, useEffect } from 'react';
import { Wrench, Play } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TaskDialog, type AutomatedTaskConfig } from '../components/maintenance/TaskDialog';
import { TaskProgress } from '../components/maintenance/TaskProgress';
import { TaskOutput } from '../components/maintenance/TaskOutput';
import { automatedTaskService, type TaskProgress as TaskProgressType } from '../services/automatedTasks';
import { settingsService } from '../services/settings';
import { theme } from '../theme';

export function Maintenance() {
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [activeTasks, setActiveTasks] = useState<TaskProgressType[]>([]);
  const [taskMessages, setTaskMessages] = useState<string[]>(['System initialized and ready...']);
  const [apiKey, setApiKey] = useState<string>();

  useEffect(() => {
    // Load API key from settings
    settingsService.getSettings().then(settings => {
      setApiKey(settings.apiKey);
    });

    // Subscribe to task updates
    return automatedTaskService.subscribe((tasks) => {
      setActiveTasks(tasks);
      
      // Add new messages for task status changes
      tasks.forEach(task => {
        setTaskMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage !== task.message) {
            return [...prev, task.message];
          }
          return prev;
        });
      });
    });
  }, []);

  const handleStartTask = async (config: AutomatedTaskConfig) => {
    if (config.type === 'import' && config.modelType === 'Account') {
      if (!apiKey) {
        setTaskMessages(prev => [...prev, 'Error: API key not configured']);
        return;
      }
      if (!config.upToDate) {
        setTaskMessages(prev => [...prev, 'Error: Up to date not specified']);
        return;
      }
    }

    await automatedTaskService.startTask(config, apiKey);
    setShowTaskDialog(false);
  };

  const handleCancelTask = (taskId: string) => {
    automatedTaskService.cancelTask(taskId);
  };

  // Sort tasks with running tasks first, then by start time (newest first)
  const sortedTasks = [...activeTasks].sort((a, b) => {
    if (a.status === 'running' && b.status !== 'running') return -1;
    if (a.status !== 'running' && b.status === 'running') return 1;
    return b.startedAt.getTime() - a.startedAt.getTime();
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Wrench className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className={`text-2xl font-semibold ${theme.text()}`}>
            System Maintenance
          </h1>
        </div>
        <Button onClick={() => setShowTaskDialog(true)}>
          <Play className="w-4 h-4 mr-2" />
          Start Automated Task
        </Button>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-6">
          {sortedTasks.length > 0 && (
            <Card className="p-4 space-y-4">
              <h2 className={`text-lg font-semibold ${theme.text()}`}>Tasks</h2>
              <div className="space-y-3">
                {sortedTasks.map((task) => (
                  <TaskProgress
                    key={task.id}
                    name={task.name}
                    progress={task.progress}
                    status={task.status}
                    message={task.message}
                    onCancel={task.status === 'running' ? () => handleCancelTask(task.id) : undefined}
                  />
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Task Output - Fixed Height */}
        <div className="flex-none">
          <Card>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`text-lg font-semibold ${theme.text()}`}>Task Output</h2>
            </div>
            <TaskOutput messages={taskMessages} />
          </Card>
        </div>
      </div>

      <TaskDialog
        isOpen={showTaskDialog}
        onClose={() => setShowTaskDialog(false)}
        onSubmit={handleStartTask}
        apiKey={apiKey}
      />
    </div>
  );
}