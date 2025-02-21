import { theme } from '../../theme';

interface CardProps {
  variant?: 'primary' | 'secondary';
  className?: string;
  children: React.ReactNode;
}

export function Card({ 
  variant = 'primary', 
  className = '', 
  children 
}: CardProps) {
  return (
    <div className={`${theme.component('card', variant)} ${className}`}>
      {children}
    </div>
  );
}