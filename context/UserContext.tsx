import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'tenant' | 'landlord' | 'agent' | null;

interface UserContextType {
  role: UserRole;
  user: any | null;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateRole: (role: UserRole) => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedRole = await AsyncStorage.getItem('@user_role');
      const storedUser = await AsyncStorage.getItem('@user_data');
      if (storedRole) setRole(storedRole as UserRole);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error('Failed to load user state', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, userRole: UserRole) => {
    const userData = { email, lastLogin: new Date().toISOString() };
    setRole(userRole);
    setUser(userData);
    await AsyncStorage.setItem('@user_role', userRole || '');
    await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
  };

  const logout = async () => {
    setRole(null);
    setUser(null);
    await AsyncStorage.removeItem('@user_role');
    await AsyncStorage.removeItem('@user_data');
  };

  const updateRole = async (newRole: UserRole) => {
    setRole(newRole);
    await AsyncStorage.setItem('@user_role', newRole || '');
  };

  return (
    <UserContext.Provider value={{ role, user, login, logout, updateRole, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
