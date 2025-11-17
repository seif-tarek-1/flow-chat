
import React, { useState, useEffect, createContext, useCallback } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import type { User, Page, Theme } from './types';
import { currentUser as mockUser } from './data';
import AuthPage from './components/AuthPage';
import ChatsPage from './components/ChatsPage';
import SettingsPage from './components/SettingsPage';

interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('AUTH');
  const [theme, setTheme] = useState<Theme>('dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('flowchat_user');
    const savedTheme = localStorage.getItem('flowchat_theme') as Theme;
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setPage('CHATS');
    }
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
        // Default to user's system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('flowchat_theme', theme);
  }, [theme]);

  const login = useCallback((user: User) => {
    const userToSave = { ...mockUser, ...user };
    setCurrentUser(userToSave);
    localStorage.setItem('flowchat_user', JSON.stringify(userToSave));
    setPage('CHATS');
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('flowchat_user');
    setPage('AUTH');
  }, []);
  
  const updateUser = useCallback((userData: Partial<User>) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...userData };
      localStorage.setItem('flowchat_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const renderPage = () => {
    if (!currentUser) {
        return <AuthPage onLogin={login} />;
    }
    switch (page) {
      case 'CHATS':
        return <ChatsPage currentUser={currentUser} onNavigate={setPage} />;
      case 'SETTINGS':
        return <SettingsPage onNavigate={setPage} theme={theme} setTheme={setTheme} />;
      default:
        return <ChatsPage currentUser={currentUser} onNavigate={setPage} />;
    }
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary-dark"></div>
        </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId="220714941973-ulma5p2df0rfov3q5psljmurq69f91ho.apps.googleusercontent.com">
      <AuthContext.Provider value={{ currentUser, login, logout, updateUser }}>
        <div className={`w-full h-screen font-sans text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark transition-colors duration-300`}>
          {renderPage()}
        </div>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
