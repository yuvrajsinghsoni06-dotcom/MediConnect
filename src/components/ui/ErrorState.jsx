import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching healthcare data. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-8 text-center bg-red-50/50 rounded-xl border border-red-200 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-[#DC2626] mx-auto mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-[#991B1B]">{title}</h3>
      <p className="mt-1 text-sm text-[#991B1B]/80 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
