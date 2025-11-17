
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../App';
import type { Page, Theme } from '../types';
import Avatar from './Avatar';
import { ArrowLeftIcon, LogoutIcon, SunIcon, MoonIcon } from './icons';

interface SettingsPageProps {
  onNavigate: (page: Page) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate, theme, setTheme }) => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { currentUser, logout, updateUser } = authContext;
  
  const [name, setName] = useState(currentUser?.name || '');
  const [status, setStatus] = useState(currentUser?.status || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setName(currentUser?.name || '');
    setStatus(currentUser?.status || '');
  }, [currentUser]);

  const handleSave = () => {
    if (currentUser) {
        updateUser({ name, status });
        setIsEditing(false);
    }
  };

  const SettingItem: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string; action?: React.ReactNode }> = ({ icon, title, subtitle, action }) => (
    <div className="flex items-center p-4 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-secondary">
      <div className="p-2 text-text-secondary-light dark:text-text-secondary-dark">{icon}</div>
      <div className="flex-grow mx-4">
        <p className="font-semibold text-text-light dark:text-text-dark">{title}</p>
        {subtitle && <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
  
  const ThemeToggle = () => (
    <div className="flex items-center p-1 space-x-1 bg-gray-200 rounded-full dark:bg-background-dark">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'bg-white shadow' : 'hover:bg-gray-300 dark:hover:bg-secondary'}`}
      >
        <SunIcon className="w-5 h-5 text-yellow-500" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-secondary shadow' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`}
      >
        <MoonIcon className="w-5 h-5 text-blue-300" />
      </button>
    </div>
  );

  if (!currentUser) {
      onNavigate('AUTH');
      return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <header className="flex items-center p-4 bg-primary text-white shadow-md flex-shrink-0">
        <button onClick={() => onNavigate('CHATS')} className="p-2 ml-4 rounded-full hover:bg-white/20">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">الإعدادات</h1>
      </header>

      <div className="flex-grow overflow-y-auto">
        <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
            <div className="relative inline-block">
                <Avatar user={currentUser} size="xl" />
                {/* Edit avatar button could go here */}
            </div>
          {isEditing ? (
            <div className="mt-4 space-y-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 text-center text-xl font-bold bg-gray-100 border border-gray-300 rounded-md dark:bg-secondary dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-dark"
                />
                 <input
                    type="text"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full max-w-xs px-3 py-1 text-center text-sm text-text-secondary-dark bg-gray-100 border border-gray-300 rounded-md dark:bg-secondary dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-dark"
                />
                <div className="flex justify-center gap-2 pt-2">
                    <button onClick={handleSave} className="px-4 py-1 text-sm text-white rounded-md bg-primary-dark hover:bg-primary">حفظ</button>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-1 text-sm bg-gray-200 rounded-md dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">إلغاء</button>
                </div>
            </div>
          ) : (
            <div className="mt-4" onClick={() => setIsEditing(true)}>
              <h2 className="text-2xl font-bold cursor-pointer">{currentUser.name}</h2>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark cursor-pointer">{currentUser.status}</p>
            </div>
          )}
        </div>
        
        <div className="py-4">
            <SettingItem icon={<i className="fa-solid fa-user-shield w-6 text-center"></i>} title="الحساب" subtitle="إعدادات الخصوصية والأمان" />
            <SettingItem icon={<i className="fa-solid fa-bell w-6 text-center"></i>} title="الإشعارات" subtitle="إشعارات الرسائل والمجموعات" />
            <SettingItem icon={<i className="fa-solid fa-palette w-6 text-center"></i>} title="المظهر" subtitle="السمة، الخلفية" action={<ThemeToggle />} />
            <SettingItem icon={<i className="fa-solid fa-circle-info w-6 text-center"></i>} title="المساعدة" subtitle="مركز المساعدة، اتصل بنا" />
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={logout} className="flex items-center w-full px-4 py-3 text-lg font-semibold text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
                <LogoutIcon className="w-6 h-6 ml-4" />
                تسجيل الخروج
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
