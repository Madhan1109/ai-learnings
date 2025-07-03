import React, { createContext, useContext, useState, ReactNode } from 'react';
import { setAuthToken } from '../../api';
import jwt_decode from 'jwt-decode';

export interface User {
  id: number;
  username: string;
  email?: string;
  roles?: string[];
  [key: string]: any;
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeUser(token: string | null): User | null {
  if (!token) return null;
  try {
    const decoded: any = jwt_decode(token);
    // Adjust field names as per your JWT payload
    return {
      id: decoded.sub || decoded.id,
      username: decoded.username,
      email: decoded.email,
      roles: decoded.roles || [],
      ...decoded,
    };
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem('jwtToken')
  );
  const [user, setUser] = useState<User | null>(() => decodeUser(localStorage.getItem('jwtToken')));

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('jwtToken', newToken);
    } else {
      localStorage.removeItem('jwtToken');
    }
    setTokenState(newToken);
    setUser(decodeUser(newToken));
    setAuthToken(newToken);
  };

  React.useEffect(() => {
    setAuthToken(token);
    setUser(decodeUser(token));
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 