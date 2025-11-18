
import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-24 w-24',
  };

  return (
    <img
      className={`rounded-full object-cover ${sizeClasses[size]}`}
      src={src}
      alt={alt}
    />
  );
};

export default Avatar;
