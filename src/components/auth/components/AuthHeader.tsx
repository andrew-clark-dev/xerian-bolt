import { Lock } from 'lucide-react';
import { theme } from '../../../theme';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className={`p-3 rounded-xl ${theme.surface('secondary')}`}>
          <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <h2 className={`text-3xl font-bold ${theme.text()}`}>
        {title}
      </h2>
      <p className={`mt-2 ${theme.text('secondary')}`}>
        {subtitle}
      </p>
    </div>
  );
}