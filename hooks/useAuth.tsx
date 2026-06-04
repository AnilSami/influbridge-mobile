import React, { createContext, useContext, useState, useEffect } from 'react';
import { MockAPI, User } from '../api/mockData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  loginAsRole: (role: 'VENDOR' | 'INFLUENCER' | 'ADMIN') => void;
  register: (data: {
    email: string;
    role: 'VENDOR' | 'INFLUENCER' | 'ADMIN';
    companyName?: string;
    displayName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initialise using mock session
    const currentUser = MockAPI.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    // Simulate slight network delay for high fidelity loader spinner
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Auto-detect role or default based on email keyword
    let role: 'VENDOR' | 'INFLUENCER' | 'ADMIN' = 'INFLUENCER';
    if (email.includes('vendor')) role = 'VENDOR';
    else if (email.includes('admin')) role = 'ADMIN';

    const mockUser = MockAPI.login(email, role);
    setUser(mockUser);
    setLoading(false);
  };

  const loginAsRole = (role: 'VENDOR' | 'INFLUENCER' | 'ADMIN') => {
    let email = 'influencer@influbridge.com';
    if (role === 'VENDOR') email = 'vendor@influbridge.com';
    if (role === 'ADMIN') email = 'admin@influbridge.com';

    const mockUser = MockAPI.login(email, role);
    setUser(mockUser);
  };

  const register = async (data: any) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockUser = MockAPI.register(data.email, data.role, data);
    setUser(mockUser);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    MockAPI.logout();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsRole, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
