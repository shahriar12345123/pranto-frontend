import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      name,
      options = [],
      placeholder = 'Select an option',
      required = false,
      disabled = false,
      className = '',
      selectClassName = '',
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const selectId = id || name;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`
              w-full min-h-[44px] px-3.5 py-2.5 pr-10 rounded-lg border text-sm text-slate-900 bg-white
              appearance-none transition-colors duration-150 cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600
              disabled:bg-slate-100 disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'}
              ${selectClassName}
            `}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => {
              const val = typeof option === 'object' ? option.value : option;
              const lbl = typeof option === 'object' ? option.label : option;
              return (
                <option key={val} value={val}>
                  {lbl}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3.5 text-slate-400 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select';
