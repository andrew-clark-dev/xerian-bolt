import { createContext, useContext, useState, useCallback } from 'react';
import { getCurrentUser, signIn, signOut, signUp, confirmSignUp } from 'aws-amplify/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ signInStep?: string }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<{ isSignUpComplete: boolean; nextStep: any }>;
  confirmSignupCode: (email: string, code: string) => Promise<boolean>;
}

interface User {
  email: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const checkAuthState = useCallback(async () => {
    try {
      const { username, signInDetails } = await getCurrentUser();
      if (username) {
        setUser({
          email: username,
          name: signInDetails?.loginId || username,
        });
      }
    } catch (err) {
      setUser(null);
    }
  }, []);

  useState(() => {
    checkAuthState();
  });

  const login = useCallback(async (email: string, password: string) => {
    const { isSignedIn, nextStep } = await signIn({ username: email, password });
    
    if (isSignedIn) {
      setUser({
        email,
        name: email.split('@')[0],
      });
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