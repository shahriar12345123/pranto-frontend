import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ className = '', placeholder = 'Search earbuds, smartwatches, chargers...', autoFocus = false, onSearchSubmit }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      if (onSearchSubmit) onSearchSubmit();
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-3.5 text-slate-400 pointer-events-none">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full h-10 sm:h-11 pl-10 pr-20 rounded-xl bg-slate-100/90 hover:bg-slate-100 border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 shadow-2xs"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-14 p-1 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      <button
        type="submit"
        className="absolute right-1.5 h-7 sm:h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer"
        aria-label="Submit search"
      >
        Search
      </button>
    </form>
  );
};
