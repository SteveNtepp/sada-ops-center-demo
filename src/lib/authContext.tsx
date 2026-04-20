'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('sada_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (role: UserRole) => {
    const roleUser = mockUsers.find(u => u.role === role) || mockUsers[0];
    setUser(roleUser);
    localStorage.setItem('sada_user', JSON.stringify(roleUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sada_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
