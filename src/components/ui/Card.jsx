import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  bordered = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl ${bordered ? 'border border-[#E2E8F0]' : ''} shadow-soft ${
        hoverEffect ? 'transition-all duration-200 hover:shadow-soft-lg hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-5 sm:p-6 border-b border-[#E2E8F0]/80 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', as: Component = 'h3' }) => (
  <Component className={`text-lg font-bold text-[#0F172A] tracking-tight ${className}`}>
    {children}
  </Component>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-[#64748B] mt-1 leading-relaxed ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-5 sm:p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-5 sm:p-6 bg-slate-50/60 rounded-b-xl border-t border-[#E2E8F0]/80 ${className}`}>
    {children}
  </div>
);
