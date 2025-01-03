import { v4 as uuidv4 } from 'uuid';
import { TaskProgress, TaskResult, TaskConfig } from './types';
import { InitializeModelCountsTask } from './InitializeModelCountsTask';
import { TruncateTableTask } from './TruncateTableTask';
import { ImportTask } from './import_task';

export class TaskManager {
  private tasks: Map<string, TaskProgress> = new Map();
  private listeners: Set<(tasks: TaskProgress[]) => void> = new Set();
  private activeTask: ImportTask | InitializeModelCountsTask | TruncateTableTask | null = null;

  subscribe(callback: (tasks: TaskProgress[]) => void) {
    this.listeners.add(callback);
    callback(Array.from(this.tasks.values()));
    return () => this.listeners.delete(callback);
  }

  private notify() {
    const tasks = Array.from(this.tasks.values());
    this.listeners.forEach(listener => listener(tasks));
  }

  async startTask(config: TaskConfig, apiKey: string): Promise<string> {
    const taskId = uuidv4();
    const task: TaskProgress = {
      id: taskId,
      name: config.name,
      modelType: config.modelType,
      progress: 0,
      status: 'running',
      message: `Initializing ${config.name}...`,
      startedAt: new Date(),
    };

    this.tasks.set(taskId, task);
    this.notify();

    if (config.name === 'Truncate Table') {
      this.activeTask = new TruncateTableTask({
        tableName: config.modelType,
        onProgress: (progress, message) => {
          this.updateTaskProgress(taskId, progress, message);
        },
      });
    } else if (config.name === 'Initialize Model Counts') {
      this.activeTask = new InitializeModelCountsTask({
        onProgress: (progress, message) => {
          this.updateTaskProgress(taskId, progress, message);
        },
      });
    } else if (config.name.startsWith('Import')) {
      if (!apiKey) {
        throw new Error('API key is required for import tasks');
      }

      const importType = config.name.split(' ')[1].toLowerCase() as 'accounts' | 'items' | 'categories' | 'sales';
      this.activeTask = ImportTask.create({
        apiKey,
        dateRange: config.dateRange,
        onProgress: (progress, message) => {
          this.updateTaskProgress(taskId, progress, message);
        },
        importType
      });
    }

    try {
      const result = await this.activeTask!.execute();
      this.completeTask(taskId, result);
    } catch (error) {
      this.failTask(taskId, error as Error);
    }

    return taskId;
  }

  cancelTask(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'running') return;

    if (this.activeTask) {
      this.activeTask.abort();
    }

    this.tasks.set(taskId, {
      ...task,
      status: 'cancelled',
      message: 'Task cancelled by user',
      completedAt: new Date(),
    });

    this.notify();
  }

  private updateTaskProgress(taskId: string, progress: number, message: string) {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'running') return;

    this.tasks.set(taskId, {
      ...task,
      progress,
      message,
    });

    this.notify();
  }

  private completeTask(taskId: string, result: TaskResult) {
    const task = this.tasks.get(taskId);
    if (!task) return;

    this.tasks.set(taskId, {
      ...task,
      status: result.success ? 'completed' : 'failed',
      progress: 100,
      message: result.message,
      completedAt: new Date(),
    });

    this.notify();
  }

  private failTask(taskId: string, error: Error) {
    const task = this.tasks.get(taskId);
    if (!task) return;

    this.tasks.set(taskId, {
      ...task,
      status: 'failed',
      message: `Failed to execute task: ${error.message}`,
      completedAt: new Date(),
    });

    this.notify();
  }
}



export const taskManager = new TaskManager();
