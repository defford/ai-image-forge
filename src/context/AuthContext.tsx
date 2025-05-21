'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean | null;
  authenticate: (passcode: string) => boolean;
  logout: () => void;
};

// Default value is used when a component is rendered outside of the provider
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  authenticate: () => false,
  logout: () => {},
});

// For development purposes, we're using an environment variable
const CORRECT_PASSCODE = process.env.NEXT_PUBLIC_APP_PASSCODE;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if the user is already authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Authenticate the user with the provided passcode
  const authenticate = (passcode: string): boolean => {
    if (passcode === CORRECT_PASSCODE) {
      localStorage.setItem('auth_token', 'authenticated');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Logout the user by removing the token
  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
