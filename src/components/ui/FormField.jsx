import React from 'react';

export const FormField = ({
  label,
  error,
  helperText,
  id,
  required = false,
  children,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-[#0F172A] mb-1.5">
          {label}
          {required && <span className="text-[#DC2626] ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-[#64748B]">
          {helperText}
        </p>
      )}
    </div>
  );
};
