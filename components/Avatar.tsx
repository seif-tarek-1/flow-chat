
import React from 'react';
import type { User } from '../types';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`relative flex-shrink-0 ${sizeClasses[size]}`}>
      <img
        className="w-full h-full rounded-full object-cover"
        src={user.avatarUrl}
        alt={user.name}
      />
      {user.online && (
        <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-panel-dark"></span>
      )}
    </div>
  );
};

export default Avatar;
