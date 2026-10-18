import React from 'react';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Search,
  CheckCircle2,
  Smartphone,
  Monitor
} from 'lucide-react';
import { getTimeGreeting } from '../utils/dateUtils';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  mobileViewOnly: boolean;
  onToggleMobileView: () => void;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  completedTodayCount: number;
  totalTodayCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  soundEnabled,
  onToggleSound,
  mobileViewOnly,
  onToggleMobileView,
  isSearchOpen,
  onToggleSearch,
  searchQuery,
  onSearchChange,
  completedTodayCount,
  totalTodayCount
}) => {
  const { greeting } = getTimeGreeting();

  const handleSoundToggle = () => {
    onToggleSound();
  };

  const progressPercent = totalTodayCount > 0 ? Math.round((completedTodayCount / totalTodayCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Left: App Brand & Greeting */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
              {greeting}
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              RejaKun · {completedTodayCount}/{totalTodayCount} bajarildi ({progressPercent}%)
            </p>
          </div>
        </div>

        {/* Right Action Icons (Strictly accessible hitboxes >= 40px) */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Search Toggle */}
          <button
            onClick={() => {
              soundManager.playTap();
              onToggleSearch();
            }}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
              isSearchOpen
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Qidiruv"
            aria-label="Qidirish"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={soundEnabled ? "Ovozni o'chirish" : "Ovozni yoqish"}
            aria-label="Ovoz sozlamasi"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => {
              soundManager.playTap();
              onToggleDarkMode();
            }}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? "Yorug' rejim" : "Tungi rejim"}
            aria-label="Mavzu"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Device Frame View Toggle (Desktop helper) */}
          <button
            onClick={() => {
              soundManager.playTap();
              onToggleMobileView();
            }}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={mobileViewOnly ? "Kengaytirilgan ekranga o'tish" : "Mobil ramkaga o'tish"}
            aria-label="Ko'rinish rejimi"
          >
            {mobileViewOnly ? (
              <Monitor className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            ) : (
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Search Input */}
      {isSearchOpen && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Vazifa nomi yoki tavsifini qidiring..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};
