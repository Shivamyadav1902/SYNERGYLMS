
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `
    bg-white dark:bg-secondary-800 
    rounded-xl shadow-md 
    overflow-hidden 
    transition-all duration-300 
    ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''}
    ${className}
  `;

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
