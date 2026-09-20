import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed select-none cursor-pointer';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-[0.99]',
    secondary: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm active:scale-[0.99]',
    outline: 'border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50/70 active:scale-[0.99]',
    dark: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:scale-[0.99]',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    dangerOutline: 'border border-red-200 text-red-600 hover:bg-red-50',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
  };

  const sizeStyles = {
    sm: 'min-h-[36px] px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'min-h-[44px] px-4 sm:px-5 py-2.5 text-sm rounded-lg gap-2',
    lg: 'min-h-[46px] sm:min-h-[50px] px-3.5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl gap-2 font-semibold',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};
