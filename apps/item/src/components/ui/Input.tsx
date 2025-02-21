import { theme } from '../../theme';
import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'error';
}

export function Input({ 
  variant = 'primary', 
  className = '', 
  ...props 
}: InputProps) {
  return (
    <input
      className={`${theme.component('input', variant)} ${className}`}
      {...props}
    />
  );
}