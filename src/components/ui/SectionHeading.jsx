import React from 'react';

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = 'center', // center, left
  className = '',
}) => {
  const alignments = {
    center: 'text-center mx-auto max-w-3xl items-center',
    left: 'text-left max-w-3xl items-start',
  };

  return (
    <div className={`flex flex-col mb-12 sm:mb-16 ${alignments[align] || alignments.center} ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-[#DC2626] bg-[#FEE2E2] mb-3 border border-red-200">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3.5 text-base sm:text-lg text-[#64748B] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
