import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCurrentUser, signIn, signOut, signUp, confirmSignUp } from 'aws-amplify/auth';
import { User, userService } from '../services/user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ signInStep?: string }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<{ isSignUpComplete: boolean; nextStep: unknown }>;
  confirmSignupCode: (email: string, code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const checkAuthState = useCallback(async () => {
    try {
      const cognitoUser = await getCurrentUser();
      if (cognitoUser.username) {
        const userData = await userService.syncUserData(cognitoUser);
        setUser(userData);
      }
    } catch (err) {
      console.error('Auth state check failed:', err);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const login = useCallback(async (email: string, password: string) => {
    const { isSignedIn, nextStep } = await signIn({ username: email, password });

    if (isSignedIn) {
      const cognitoUser = await getCurrentUser();
      const user = await userService.syncUserData(cognitoUser);
      setUser(user);
    }

    return { signInStep: nextStep?.signInStep };
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
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
  }, []);

  const confirmSignupCode = useCallback(async (email: string, code: string) => {
    const { isSignUpComplete } = await confirmSignUp({
      username: email,
      confirmationCode: code,
    });

    return isSignUpComplete;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        signup,
        confirmSignupCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}