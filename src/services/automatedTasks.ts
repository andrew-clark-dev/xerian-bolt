import { v4 as uuidv4 } from 'uuid';
import { AutomatedTaskConfig } from '../components/maintenance/TaskDialog';
import { ImportService } from './import/ImportService';

export interface TaskProgress {
  id: string;
  name: string;
  type: string;
  modelType?: string;
  progress: number;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  message: string;
  startedAt: Date;
  completedAt?: Date;
}

class AutomatedTaskService {
  private tasks: Map<string, TaskProgress> = new Map();
  private listeners: Set<(tasks: TaskProgress[]) => void> = new Set();
  private importServices: Map<string, ImportService> = new Map();

  subscribe(callback: (tasks: TaskProgress[]) => void) {
    this.listeners.add(callback);
    callback(Array.from(this.tasks.values()));
    return () => this.listeners.delete(callback);
  }

  private notify() {
    const tasks = Array.from(this.tasks.values());
    this.listeners.forEach(listener => listener(tasks));
  }

  async startTask(config: AutomatedTaskConfig): Promise<string> {
    const taskId = uuidv4();
    
    const task: TaskProgress = {
      id: taskId,
      name: config.name,
      type: config.type,
      modelType: config.modelType,
      progress: 0,
      status: 'running',
      message: this.getInitialMessage(config),
      startedAt: new Date(),
    };

    this.tasks.set(taskId, task);
    this.notify();

    if (config.type === 'import' && config.modelType) {
      await this.handleImportTask(taskId, config);
    } else {
      // Handle other task types
      this.simulateProgress(taskId);
    }

    return taskId;
  }

  cancelTask(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== 'running') return;

    // Cancel import service if it exists
    const importService = this.importServices.get(taskId);
    if (importService) {
      importService.abort();
      this.importServices.delete(taskId);
    }

    // Update task status
    this.tasks.set(taskId, {
      ...task,
      status: 'cancelled',
      message: 'Task cancelled by user',
      completedAt: new Date(),
    });

    this.notify();
  }

  private async handleImportTask(taskId: string, config: AutomatedTaskConfig) {
    if (!config.modelType) return;

    const importService = new ImportService({
      modelType: config.modelType,
      batchSize: 50,
      retryAttempts: 3,
      retryDelay: 1000,
    });

    this.importServices.set(taskId, importService);

    try {
      for await (const progress of importService.execute()) {
        const task = this.tasks.get(taskId);
        if (!task || task.status !== 'running') break;

        const percentComplete = (progress.count / progress.total) * 100;
        
        this.tasks.set(taskId, {
          ...task,
          progress: percentComplete,
          message: progress.message,
        });
        
        this.notify();
      }

      const task = this.tasks.get(taskId);
      if (task?.status === 'running') {
        this.tasks.set(taskId, {
          ...task,
          status: 'completed',
          progress: 100,
          message: `Successfully imported ${config.modelType} data`,
          completedAt: new Date(),
        });
      }
    } catch (error) {
      const task = this.tasks.get(taskId);
      if (task) {
        this.tasks.set(taskId, {
          ...task,
          status: 'failed',
          message: `Failed to import ${config.modelType} data: ${error.message}`,
          completedAt: new Date(),
        });
      }
    } finally {
      this.importServices.delete(taskId);
      this.notify();
    }
  }

  private getInitialMessage(config: AutomatedTaskConfig): string {
    switch (config.type) {
      case 'import':
        return `Initializing ${config.modelType} import...`;
      case 'reset':
        return 'Preparing to reset all data...';
      default:
        return 'Initializing...';
    }
  }

  private simulateProgress(taskId: string) {
    const updateInterval = setInterval(() => {
      const task = this.tasks.get(taskId);
      if (!task || task.status !== 'running') {
        clearInterval(updateInterval);
        return;
      }

      const newProgress = Math.min(task.progress + Math.random() * 10, 100);
      
      if (newProgress === 100) {
        this.tasks.set(taskId, {
          ...task,
          progress: 100,
          status: 'completed',
          message: this.getCompletionMessage(task as AutomatedTaskConfig),
          completedAt: new Date(),
        });
        clearInterval(updateInterval);
      } else {
        this.tasks.set(taskId, {
          ...task,
          progress: newProgress,
          message: this.getProgressMessage(task as AutomatedTaskConfig, newProgress),
        });
      }

      this.notify();
    }, 1000);

    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      setTimeout(() => {
        const task = this.tasks.get(taskId);
        if (task?.status === 'running') {
          clearInterval(updateInterval);
          this.tasks.set(taskId, {
            ...task,
            status: 'failed',
            message: this.getFailureMessage(task as AutomatedTaskConfig),
            completedAt: new Date(),
          });
          this.notify();
        }
      }, Math.random() * 5000 + 2000);
    }
  }

  private getProgressMessage(config: AutomatedTaskConfig, progress: number): string {
    switch (config.type) {
      case 'import':
        return `Importing ${config.modelType} data... ${progress.toFixed(1)}% complete`;
      case 'reset':
        return `Resetting system data... ${progress.toFixed(1)}% complete`;
      default:
        return `Processing... ${progress.toFixed(1)}% complete`;
    }
  }

  private getCompletionMessage(config: AutomatedTaskConfig): string {
    switch (config.type) {
      case 'import':
        return `Successfully imported ${config.modelType} data`;
      case 'reset':
        return 'Successfully reset all system data';
      default:
        return 'Task completed successfully';
    }
  }

  private getFailureMessage(config: AutomatedTaskConfig): string {
    switch (config.type) {
      case 'import':
        return `Failed to import ${config.modelType} data: Connection timeout`;
      case 'reset':
        return 'Failed to reset system data: Database error';
      default:
        return 'Task failed: Connection timeout';
    }
  }
}

export const automatedTaskService = new AutomatedTaskService();