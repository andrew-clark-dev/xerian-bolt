import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, KeyRound, UserPlus } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'confirm-signup' | 'reset-request' | 'reset-confirm';

export function Login() {
  const navigate = useNavigate();
  const { login, signup, confirmSignupCode } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: '',
    newPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsEmailCode, setNeedsEmailCode] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (needsEmailCode) {
        // Handle email code confirmation
        const isConfirmed = await confirmSignupCode(formData.email, formData.code);
        if (isConfirmed) {
          // After confirmation, try to sign in
          await login(formData.email, formData.password);
          navigate('/');
        }
      } else {
        // Initial sign in attempt
        const nextStep = await login(formData.email, formData.password);
        
        if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE') {
          setNeedsEmailCode(true);
          setError('');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Sign in error:', err);
      if (err instanceof Error) {
        switch (err.name) {
          case 'UserNotConfirmedException':
            setError('Please verify your email address before signing in.');
            break;
          case 'NotAuthorizedException':
            setError('Incorrect username or password.');
            break;
          case 'UserNotFoundException':
            setError('No account found with this email address.');
            break;
          case 'CodeMismatchException':
            setError('Invalid verification code. Please try again.');
            break;
          default:
            setError('An error occurred during sign in. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { isSignUpComplete, nextStep } = await signup(formData.email, formData.password);

      if (!isSignUpComplete && nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setMode('confirm-signup');
      } else {
        await login(formData.email, formData.password);
        navigate('/');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      if (err instanceof Error) {
        switch (err.name) {
          case 'UsernameExistsException':
            setError('An account with this email already exists.');
            break;
          case 'InvalidPasswordException':
            setError('Password does not meet requirements.');
            break;
          default:
            setError('Failed to create account. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const isConfirmed = await confirmSignupCode(formData.email, formData.code);
      if (isConfirmed) {
        await login(formData.email, formData.password);
        navigate('/');
      }
    } catch (err) {
      console.error('Confirmation error:', err);
      if (err instanceof Error) {
        switch (err.name) {
          case 'CodeMismatchException':
            setError('Invalid verification code. Please try again.');
            break;
          default:
            setError('Failed to confirm signup. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 text-white rounded-xl flex items-center justify-center">
            {mode === 'signup' ? (
              <UserPlus className="h-6 w-6" />
            ) : (
              <LogIn className="h-6 w-6" />
            )}
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {mode === 'signin' && 'Welcome back'}
            {mode === 'signup' && 'Create an account'}
            {mode === 'confirm-signup' && 'Verify your email'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'signin' && 'Sign in to access your dashboard'}
            {mode === 'signup' && 'Sign up to get started'}
            {mode === 'confirm-signup' && 'Enter the verification code sent to your email'}
          </p>
        </div>

        {mode === 'signin' && (
          <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Password"
                  />
                </div>
              </div>

              {needsEmailCode && (
                <div>
                  <label htmlFor="code" className="sr-only">
                    Verification Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="code"
                      name="code"
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter verification code"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                    setFormData({ email: '', password: '', code: '', newPassword: '' });
                  }}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Don't have an account?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="signup-email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="signup-password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Password"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Password must be at least 20 characters long and contain at least one number
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError('');
                    setFormData({ email: '', password: '', code: '', newPassword: '' });
                  }}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Already have an account?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        )}

        {mode === 'confirm-signup' && (
          <form className="mt-8 space-y-6" onSubmit={handleConfirmSignUp}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="confirmation-code" className="sr-only">
                Confirmation Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmation-code"
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter confirmation code"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}