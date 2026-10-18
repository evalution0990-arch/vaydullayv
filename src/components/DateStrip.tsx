import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, RotateCcw } from 'lucide-react';
import { getDaysWindow, getTodayYMD, parseYMD, UZ_MONTHS } from '../utils/dateUtils';
import { Task } from '../types';
import { soundManager } from '../utils/audio';

interface DateStripProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  tasks: Task[];
}

export const DateStrip: React.FC<DateStripProps> = ({
  selectedDate,
  onSelectDate,
  tasks
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const todayStr = getTodayYMD();
  const days = getDaysWindow(todayStr, 7, 21);

  const selectedDateObj = parseYMD(selectedDate);
  const currentMonthName = UZ_MONTHS[selectedDateObj.getMonth()];
  const currentYear = selectedDateObj.getFullYear();

  // Scroll active day into view
  useEffect(() => {
    if (containerRef.current) {
      const activeElement = containerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedDate]);

  const handleSelect = (dateStr: string) => {
    soundManager.playTap();
    onSelectDate(dateStr);
  };

  const handleJumpToday = () => {
    soundManager.playTap();
    onSelectDate(todayStr);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80 px-4 pt-3 pb-2 transition-colors">
      {/* Month & Jump-to-Today bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {currentMonthName} {currentYear}
          </span>
        </div>

        {selectedDate !== todayStr && (
          <button
            onClick={handleJumpToday}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-full hover:bg-emerald-100 transition-colors active:scale-95"
            title="Bugungi kunga o'tish"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Bugun</span>
          </button>
        )}
      </div>

      {/* Horizontal Day Scroller */}
      <div
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth snap-x"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {days.map((d) => {
          const isSelected = d.dateStr === selectedDate;
          const dayTasks = tasks.filter((t) => t.date === d.dateStr);
          const hasTasks = dayTasks.length > 0;
          const allCompleted = hasTasks && dayTasks.every((t) => t.completed);

          return (
            <button
              key={d.dateStr}
              data-active={isSelected ? 'true' : 'false'}
              onClick={() => handleSelect(d.dateStr)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-12 h-16 rounded-2xl transition-all duration-200 snap-center relative ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-105'
                  : d.isToday
                  ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/50'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span
                className={`text-[11px] font-semibold tracking-wider ${
                  isSelected ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-400'
                }`}
              >
                {d.dayNameShort}
              </span>
              <span className="text-base font-bold tabular-nums mt-0.5">
                {d.dayNumber}
              </span>

              {/* Task Indicator Dot */}
              <div className="absolute bottom-1.5 flex items-center justify-center">
                {hasTasks && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected
                        ? 'bg-white'
                        : allCompleted
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    }`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
