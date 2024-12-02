import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Mail, Loader } from 'lucide-react';
import { Input } from '../ui/Input';
import { theme } from '../../theme';
import { PasswordChangeForm } from './PasswordChangeForm';
import { AuthContainer, AuthFormContainer } from './components/AuthContainer';
import { AuthHeader } from './components/AuthHeader';
import { AuthError } from './components/AuthError';
import { PasswordInput } from './components/PasswordInput';

export function LoginForm() {
  const { login, confirmSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setShowPasswordChange(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (newPassword: string) => {
    try {
      await confirmSignIn(newPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
      setShowPasswordChange(false);
    }
  };

  if (showPasswordChange) {
    return (
      <PasswordChangeForm
        onSubmit={handlePasswordChange}
        onCancel={() => setShowPasswordChange(false)}
      />
    );
  }

  return (
    <AuthContainer>
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to access your dashboard"
      />

      <AuthFormContainer>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthError message={error} />

          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${theme.text()} mb-1`}>
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            label="Password"
            placeholder="Enter your password"
            required
          />

          <div className="flex justify-end">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </AuthFormContainer>
    </AuthContainer>
  );
}