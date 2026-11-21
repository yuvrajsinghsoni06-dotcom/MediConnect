import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  options = [],
  className = '',
  id,
  required = false,
  placeholder,
  children,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-semibold text-[#0F172A] mb-1.5">
          {label}
          {required && <span className="text-[#DC2626] ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`appearance-none block w-full rounded-lg border text-sm text-[#0F172A] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-10 py-2.5 ${
            error
              ? 'border-red-400 focus:border-red-500 bg-red-50/20'
              : 'border-[#E2E8F0] focus:border-[#DC2626] bg-white'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value ?? opt} value={opt.value ?? opt}>
                  {opt.label ?? opt}
                </option>
              ))
            : children}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
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
});

Select.displayName = 'Select';
