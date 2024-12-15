import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCurrentUser, signIn, signOut, signUp, confirmSignUp, confirmSignIn as amplifyConfirmSignIn, type AuthUser } from 'aws-amplify/auth';
import { User, userService } from '../services/user.service';
import { Loader } from 'lucide-react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ signInStep?: string }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<{ isSignUpComplete: boolean; nextStep: unknown }>;
  confirmSignupCode: (email: string, code: string) => Promise<boolean>;
  confirmSignIn: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [cognitoUser, setCognitoUser] = useState<AuthUser | null>(null);

  const checkAuthState = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setCognitoUser(currentUser);

      // Only sync user data if we have a valid Cognito user
      if (currentUser?.userId) {
        const userData = await userService.syncUserData(currentUser);
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      // Only set error for non-authentication errors
      if (err instanceof Error && err.name !== 'UserUnAuthenticatedException') {
        setError(err);
      }
      setUser(null);
      setCognitoUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { isSignedIn, nextStep } = await signIn({ username: email, password });

      if (isSignedIn) {
        await checkAuthState();
      }

      return { signInStep: nextStep?.signInStep };
    } finally {
      setIsLoading(false);
    }
  }, [checkAuthState]);

  const confirmSignIn = useCallback(async (newPassword: string) => {
    setIsLoading(true);
    try {
      const { isSignedIn } = await amplifyConfirmSignIn({ challengeResponse: newPassword });

      if (isSignedIn) {
        await checkAuthState();
      } else {
        throw new Error('Failed to confirm sign in');
      }

    } finally {
      setIsLoading(false);
    }
  }, [checkAuthState]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
      setCognitoUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      return { isSignUpComplete, nextStep };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmSignupCode = useCallback(async (email: string, code: string) => {
    setIsLoading(true);
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      return isSignUpComplete;
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">An error occurred</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!cognitoUser?.userId,
        isLoading,
        user,
        login,
        logout,
        signup,
        confirmSignupCode,
        confirmSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}