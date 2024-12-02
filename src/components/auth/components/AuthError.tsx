import { theme } from '../../../theme';

interface AuthErrorProps {
  message: string;
}

export function AuthError({ message }: AuthErrorProps) {
  if (!message) return null;
  
  return (
    <div className={`p-3 rounded-lg ${theme.status('error')}`}>
      {message}
    </div>
  );
}