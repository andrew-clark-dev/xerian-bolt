import { useState } from 'react';
import { Button } from '../ui/Button';
import { Loader } from 'lucide-react';
import { AuthContainer, AuthFormContainer } from './components/AuthContainer';
import { AuthHeader } from './components/AuthHeader';
import { AuthError } from './components/AuthError';
import { PasswordInput } from './components/PasswordInput';
import { validatePassword, validatePasswordMatch } from './utils/validation';

interface PasswordChangeFormProps {
  onSubmit: (newPassword: string) => Promise<void>;
  onCancel: () => void;
}

export function PasswordChangeForm({ onSubmit, onCancel }: PasswordChangeFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error!);
      return;
    }

    const passwordMatchValidation = validatePasswordMatch(newPassword, confirmPassword);
    if (!passwordMatchValidation.isValid) {
      setError(passwordMatchValidation.error!);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(newPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthHeader
        title="Change Password"
        subtitle="Please set a new password for your account"
      />

      <AuthFormContainer>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthError message={error} />

          <PasswordInput
            id="newPassword"
            value={newPassword}
            onChange={setNewPassword}
            label="New Password"
            placeholder="Enter your new password"
            required
          />

          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={setConfirmPassword}
            label="Confirm Password"
            placeholder="Confirm your new password"
            required
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-32 flex justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                'Change Password'
              )}
            </Button>
          </div>
        </form>
      </AuthFormContainer>
    </AuthContainer>
  );
}