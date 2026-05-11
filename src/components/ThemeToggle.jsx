import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full transition-all border border-border bg-surface hover:border-gold group"
      aria-label="Toggle Theme"
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-gold group-hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-5 h-5 text-gold group-hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
};

export default ThemeToggle;
