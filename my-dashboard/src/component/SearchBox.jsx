import { useState, useRef } from 'react';
import { HiOutlineSearch, HiX } from 'react-icons/hi';

const SearchBox = ({ className = '', inputClassName = '', iconClassName = '' }) => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <form
      className={`relative w-full max-w-xs sm:max-w-sm ${className}`}
      action="#"
      method="get"
      autoComplete="off"
      onSubmit={e => { e.preventDefault(); }}
    >
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search here..."
        className={`w-full pr-14 pl-5 py-3 rounded-full shadow-lg bg-white/70 dark:bg-gray-700/80 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 border border-white/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300 transition-all duration-300 backdrop-blur-md ${inputClassName}`}
        aria-label="Search"
      />
      {/* Search Button */}
      <button
        type="submit"
        aria-label="Search"
        className={`absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/80 to-cyan-600/80 shadow-md border border-white/30 hover:scale-110 focus:scale-110 focus:ring-2 focus:ring-cyan-300 transition-all duration-200 group ${focused ? 'ring-2 ring-cyan-300' : ''}`}
        tabIndex={0}
      >
        <HiOutlineSearch className={`text-white text-xl transition-transform duration-200 ${iconClassName} ${focused ? 'scale-125 drop-shadow' : ''}`} />
      </button>
      {/* Clear Button */}
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          className="absolute right-14 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-white/60 hover:bg-cyan-100 text-cyan-700 shadow border border-white/30 transition-all duration-200"
          onClick={() => { setValue(''); inputRef.current?.focus(); }}
          tabIndex={0}
        >
          <HiX className="text-lg" />
        </button>
      )}
    </form>
  );
};

export default SearchBox;
