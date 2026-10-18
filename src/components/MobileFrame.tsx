import React from 'react';
import { Wifi, Battery, Signal, Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isMobileMockup: boolean;
  onToggleMockup: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  isMobileMockup,
  onToggleMockup
}) => {
  // Real-time formatted clock for the mobile status bar
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  if (!isMobileMockup) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-start">
        {/* Top desktop helper toolbar */}
        <div className="w-full max-w-5xl mx-auto px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            RejaKun · Kengaytirilgan rejim
          </span>
          <button
            onClick={onToggleMockup}
            className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-emerald-500 text-slate-700 dark:text-slate-300 font-medium transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mobil ramkani yoqish</span>
          </button>
        </div>

        {/* Wide layout container */}
        <div className="w-full max-w-md md:max-w-xl mx-auto min-h-screen bg-white dark:bg-slate-900 shadow-xl border-x border-slate-200 dark:border-slate-800 flex flex-col relative">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200/80 dark:bg-slate-950 flex flex-col items-center justify-center p-0 md:py-8 md:px-4">
      {/* Desktop Mode Switcher Bar */}
      <div className="hidden md:flex items-center justify-between w-full max-w-sm mb-3 px-2">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          📱 Mobil Ilova Ko'rinishi
        </span>
        <button
          onClick={onToggleMockup}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:text-emerald-600 border border-slate-300 dark:border-slate-800 rounded-lg shadow-2xs transition-colors"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Keng ekran</span>
        </button>
      </div>

      {/* Realistic Mobile Device Mockup Frame */}
      <div className="w-full md:max-w-[420px] h-[100dvh] md:h-[860px] bg-slate-900 rounded-none md:rounded-[48px] p-0 md:p-3 shadow-2xl md:ring-1 md:ring-slate-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] flex flex-col relative overflow-hidden transition-all">
        {/* Device Outer Bezel & Inner Screen */}
        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-none md:rounded-[40px] flex flex-col relative overflow-hidden">
          {/* iOS / Modern Mobile Status Bar */}
          <div className="h-9 px-6 bg-white dark:bg-slate-900 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white select-none z-50 flex-shrink-0 pt-1">
            <span className="tabular-nums tracking-tight text-[13px]">{timeStr}</span>

            {/* Dynamic Island / Notch Pill */}
            <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-end pr-2 gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-800" />
            </div>

            {/* Mobile Network, Wifi, Battery Status */}
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Actual Screen App Content */}
          <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
            {children}
          </div>

          {/* Mobile Home Swipe Indicator Bar */}
          <div className="h-3 w-full bg-white/95 dark:bg-slate-900/95 flex items-center justify-center flex-shrink-0 z-40 pointer-events-none pb-1">
            <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
