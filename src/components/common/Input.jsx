import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      name,
      type = 'text',
      placeholder,
      required = false,
      disabled = false,
      className = '',
      inputClassName = '',
      icon: Icon,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`
              w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white
              placeholder:text-slate-400 transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600
              disabled:bg-slate-100 disabled:cursor-not-allowed
              ${Icon ? 'pl-10' : ''}
              ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'}
              ${inputClassName}
            `}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
