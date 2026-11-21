import React from 'react';
import { Droplet } from 'lucide-react';

export const BloodGroupBadge = ({
  group = 'O+',
  size = 'md',
  showIcon = true,
  className = '',
  variant = 'solid', // solid, outline, soft
}) => {
  const sizes = {
    sm: 'text-xs px-2 py-0.5 min-w-[2.2rem]',
    md: 'text-sm px-2.5 py-1 min-w-[3rem]',
    lg: 'text-base px-3.5 py-1.5 min-w-[3.8rem] font-bold',
    xl: 'text-xl px-4 py-2 min-w-[4.8rem] font-extrabold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
  };

  const variants = {
    solid: 'bg-[#DC2626] text-white shadow-sm border border-red-700/20',
    soft: 'bg-[#FEE2E2] text-[#991B1B] font-bold border border-red-200',
    outline: 'border-2 border-[#DC2626] text-[#DC2626] bg-white font-bold',
    dark: 'bg-[#991B1B] text-white font-bold border border-red-950',
  };

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 rounded-lg tracking-tight ${variants[variant] || variants.solid} ${sizes[size] || sizes.md} ${className}`}
      title={`Blood Group ${group}`}
    >
      {showIcon && <Droplet className={`${iconSizes[size] || iconSizes.md} fill-current`} />}
      <span>{group}</span>
    </span>
  );
};
