import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({
  size = 'md',
  message = 'Loading data...',
  className = '',
}) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Loader2 className={`${sizes[size] || sizes.md} text-[#DC2626] animate-spin mb-3`} />
      {message && <p className="text-sm font-medium text-[#64748B]">{message}</p>}
    </div>
  );
};
