import { theme } from '../../theme';
import { CheckCircle2, XCircle, Loader2, XSquare } from 'lucide-react';

interface TaskProgressProps {
  progress: number;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  message: string;
  name: string;
  onCancel?: () => void;
}

export function TaskProgress({ progress, status, message, name, onCancel }: TaskProgressProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return theme.status('success');
      case 'failed':
      case 'cancelled':
        return theme.status('error');
      default:
        return theme.status('info');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />;
    }
  };

  const roundedProgress = Math.round(progress);

  return (
    <div className={`p-4 ${theme.surface('secondary')} rounded-lg border ${theme.border()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className={`font-medium ${theme.text()}`}>{name}</h3>
            <p className={`text-sm ${theme.text('secondary')}`}>{message}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {status === 'running' ? `${roundedProgress}%` : status}
          </span>
          {status === 'running' && onCancel && (
            <button
              onClick={onCancel}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Cancel task"
            >
              <XSquare className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>
      
      {status === 'running' && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${roundedProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}