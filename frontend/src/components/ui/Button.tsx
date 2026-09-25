import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success';
type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-zinc-900 text-white border-2 border-zinc-900 hover:bg-white hover:text-zinc-900',
  secondary: 'bg-white text-zinc-900 border-2 border-zinc-900 hover:bg-zinc-900 hover:text-white',
  danger: 'bg-red-600 text-white border-2 border-red-600 hover:bg-white hover:text-red-600',
  ghost: 'bg-transparent text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-400',
  outline: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white',
  success: 'bg-green-600 text-white border-2 border-green-600 hover:bg-white hover:text-green-600',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-sm',
};

export function Button({ children, variant = 'primary', size = 'md', className = '', disabled, onClick, type = 'button' }: {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
