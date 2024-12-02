import { theme } from '../../../theme';

interface AuthContainerProps {
  children: React.ReactNode;
}

export function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {children}
      </div>
    </div>
  );
}

export function AuthFormContainer({ children }: AuthContainerProps) {
  return (
    <div className={`${theme.surface()} ${theme.border()} border rounded-lg p-8`}>
      {children}
    </div>
  );
}