import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { MOCK_USERS } from '../data/users';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: Role) => Promise<boolean>;
  updateAvatar: (avatarSrc: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('lms_user');
    try {
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('lms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lms_user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log(`Attempting login for ${email}`);
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, role: Role): Promise<boolean> => {
    console.log(`Attempting to register ${email}`);
    const userExists = MOCK_USERS.find(u => u.email === email);
    if (userExists) {
      return false; // User already exists
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatar: `https://picsum.photos/seed/${name.split(' ')[0]}/200`,
      schoolId: `${role.charAt(0).toUpperCase()}-${String(Date.now()).slice(-5)}`,
      contact: `555-${String(Math.random()).slice(2,5)}-${String(Math.random()).slice(2,6)}`,
      gradeLevel: role === Role.STUDENT ? 9 : undefined, // Default to 9th grade
      courseIds: role === Role.STUDENT ? [] : undefined,
    };

    MOCK_USERS.push(newUser); 
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateAvatar = (avatarSrc: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarSrc };
      setUser(updatedUser);

      // Also update the mock user data so it feels persistent for the session
      const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        MOCK_USERS[userIndex].avatar = avatarSrc;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
