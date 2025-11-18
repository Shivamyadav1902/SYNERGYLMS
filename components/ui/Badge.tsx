
import React from 'react';

interface BadgeProps {
  color?: 'primary' | 'secondary' | 'green' | 'yellow' | 'red';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ color = 'primary', children }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
    secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
