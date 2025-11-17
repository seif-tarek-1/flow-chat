
import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import type { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

interface GoogleJwtPayload {
    name: string;
    picture: string;
    email: string;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
        const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
        const user: User = {
            id: decoded.email,
            name: decoded.name,
            avatarUrl: decoded.picture,
            email: decoded.email,
            online: true,
        };
        onLogin(user);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = email.split('@')[0];
    const user: User = {
      id: email,
      name: name,
      avatarUrl: `https://picsum.photos/seed/${name}/200/200`,
      email: email,
      online: true,
    };
    onLogin(user);
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-background-dark p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-panel-dark">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">
            {isLogin ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب جديد'}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            {!isLogin && (
                 <div>
                    <label htmlFor="name" className="sr-only">الاسم</label>
                    <input id="name" name="name" type="text" required className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary-dark focus:border-primary-dark focus:z-10 sm:text-sm dark:bg-secondary dark:border-gray-600 dark:text-white" placeholder="الاسم" />
                </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">البريد الإلكتروني</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary-dark focus:border-primary-dark focus:z-10 sm:text-sm dark:bg-secondary dark:border-gray-600 dark:text-white" placeholder="البريد الإلكتروني" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">كلمة المرور</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary-dark focus:border-primary-dark focus:z-10 sm:text-sm dark:bg-secondary dark:border-gray-600 dark:text-white" placeholder="كلمة المرور" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {isLogin && (
                <div className="text-sm">
                <a href="#" className="font-medium text-primary-dark hover:text-primary">
                    هل نسيت كلمة المرور؟
                </a>
                </div>
            )}
          </div>

          <div>
            <button type="submit" className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-primary-dark group hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
            </button>
          </div>
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-panel-dark text-gray-500 dark:text-gray-400">أو أكمل باستخدام</span>
            </div>
        </div>
        
        <div className="flex items-center justify-center">
             <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    console.log('Login Failed');
                }}
                theme="filled_black"
                shape="rectangular"
                logo_alignment="center"
             />
        </div>
        
        <div className="text-sm text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-primary-dark hover:text-primary">
                {isLogin ? 'ليس لديك حساب؟ إنشاء حساب' : 'لديك حساب بالفعل؟ تسجيل الدخول'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;