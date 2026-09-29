import type { FC } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
  compact?: boolean;
}

export const ThemeToggle: FC<ThemeToggleProps> = ({ theme, onToggle, compact = false }) => {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggle}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle light/dark theme"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-between rounded-full cursor-pointer transition-colors duration-200 select-none px-2 ${
        isDark
          ? 'bg-[#222222] border border-[#3a3a3a] text-[#F3F1E9]'
          : 'bg-[#E5E1D5] border border-[#D8D4CA] text-[#171717]'
      } ${compact ? 'h-7 w-16' : 'h-8 w-20'}`}
    >
      {/* Sun icon */}
      <Sun
        size={compact ? 12 : 14}
        className={`transition-colors duration-200 z-10 ${
          !isDark ? 'text-[#171717]' : 'text-[#6B675F]'
        }`}
      />

      {/* Sliding Knob */}
      <span
        className={`absolute top-[3px] bottom-[3px] rounded-full transition-all duration-200 shadow-sm pointer-events-none ${
          compact ? 'w-[20px]' : 'w-[24px]'
        } ${
          isDark
            ? (compact ? 'left-[calc(100%-23px)]' : 'left-[calc(100%-27px)]') + ' bg-[#6C3BFF]'
            : 'left-[3px] bg-[#171717]'
        }`}
      />

      {/* Moon icon */}
      <Moon
        size={compact ? 12 : 14}
        className={`transition-colors duration-200 z-10 ${
          isDark ? 'text-[#B9A7FF]' : 'text-[#6B675F]'
        }`}
      />
    </button>
  );
};
