import React from 'react';

export const Badge = ({
  children,
  variant = 'slate',
  size = 'md',
  className = '',
  dot = false,
  dotColor,
}) => {
  const variants = {
    red: 'bg-[#FEE2E2] text-[#991B1B] border-red-200',
    green: 'bg-emerald-50 text-[#16A34A] border-emerald-200',
    amber: 'bg-amber-50 text-[#F59E0B] border-amber-200',
    blue: 'bg-sky-50 text-sky-700 border-sky-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    slate: 'bg-slate-100 text-[#64748B] border-slate-200',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant] || variants.slate} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dotColor || (variant === 'green' ? 'bg-[#16A34A]' : variant === 'red' ? 'bg-[#DC2626]' : 'bg-current')
          }`}
        />
      )}
      {children}
    </span>
  );
};
