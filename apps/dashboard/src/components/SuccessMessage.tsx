import { CheckCircle, X } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
}

export function SuccessMessage({ message, onClose }: SuccessMessageProps) {
  return (
    <div className="rounded-lg bg-green-50 dark:bg-green-900 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircle className="h-5 w-5 text-green-400 dark:text-green-300" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            {message}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onClose}
              className="inline-flex rounded-md p-1.5 text-green-500 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}