import React, { useState, useEffect } from 'react';
import { Clock, Plus, Check, Play } from 'lucide-react';
import { Task } from '../types';
import { CATEGORIES } from '../utils/categories';
import { soundManager } from '../utils/audio';
import { getTodayYMD, getRelativeDayLabel, formatUzbekFullDate } from '../utils/dateUtils';
import { CategoryIcon } from './CategoryIcon';

interface TimelineViewProps {
  tasks: Task[];
  selectedDate: string;
  onOpenNewTaskModal: (defaultTime?: string) => void;
  onToggleTask: (taskId: string) => void;
  onStartPomodoro: (task: Task) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  tasks,
  selectedDate,
  onOpenNewTaskModal,
  onToggleTask,
  onStartPomodoro
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const isToday = selectedDate === getTodayYMD();

  // Keep track of current hour & minute for today's live marker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const dayTasks = tasks.filter((t) => t.date === selectedDate);

  // Time slots from 06:00 to 23:00
  const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6 to 23

  // Helper to calculate top position and height in px for 60px/hour scale
  const parseTimeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const currentMinutes = currentTimeStr ? parseTimeToMinutes(currentTimeStr) : 0;
  const startDayMinutes = 6 * 60; // 06:00
  const currentIndicatorTop = ((currentMinutes - startDayMinutes) / 60) * 72; // 72px per hour

  return (
    <div className="flex-1 pb-24 overflow-y-auto">
      {/* Header bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {getRelativeDayLabel(selectedDate)}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatUzbekFullDate(selectedDate)}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Kunlik vaqt chizig'i
            </h2>
          </div>

          <button
            onClick={() => {
              soundManager.playTap();
              onOpenNewTaskModal();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Vazifa</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Bo'sh soat ustiga bosib, o'sha vaqtga tezda reja qo'shishingiz mumkin.
        </p>
      </div>

      {/* Timeline Schedule Grid */}
      <div className="relative p-4 pt-2">
        {/* Current Time Line Indicator (Only visible if viewing today and between 06:00 and 23:59) */}
        {isToday && currentMinutes >= startDayMinutes && currentMinutes <= 24 * 60 && (
          <div
            className="absolute left-16 right-4 z-20 flex items-center pointer-events-none"
            style={{ top: `${currentIndicatorTop + 16}px` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50 -ml-1.5 ring-2 ring-white dark:ring-slate-900" />
            <div className="flex-1 h-0.5 bg-rose-500 shadow-xs" />
            <span className="ml-2 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 rounded tabular-nums border border-rose-200 dark:border-rose-900/60 shadow-xs">
              Hozir {currentTimeStr}
            </span>
          </div>
        )}

        {/* Hour Slots */}
        <div className="space-y-0">
          {hours.map((hour) => {
            const hourStr = String(hour).padStart(2, '0') + ':00';
            const matchingTasks = dayTasks.filter((t) => {
              const startH = parseInt(t.startTime.split(':')[0], 10);
              return startH === hour;
            });

            return (
              <div
                key={hour}
                className="flex items-start min-h-[72px] border-b border-slate-100 dark:border-slate-800/80 group relative"
              >
                {/* Time Column */}
                <div className="w-14 flex-shrink-0 pt-1 text-right pr-3">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
                    {hourStr}
                  </span>
                </div>

                {/* Slot Content */}
                <div className="flex-1 pl-2 py-1 relative">
                  {/* Empty slot quick add trigger on hover / tap */}
                  {matchingTasks.length === 0 ? (
                    <button
                      onClick={() => {
                        soundManager.playTap();
                        onOpenNewTaskModal(hourStr);
                      }}
                      className="w-full h-14 rounded-xl border border-dashed border-transparent hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 flex items-center px-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-all text-xs gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{hourStr} ga vazifa qo'shish</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      {matchingTasks.map((task) => {
                        const cat = CATEGORIES[task.category] || CATEGORIES.work;
                        return (
                          <div
                            key={task.id}
                            className={`p-3 rounded-xl border transition-all ${
                              task.completed
                                ? 'bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-75'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2.5 min-w-0">
                                <button
                                  onClick={() => {
                                    soundManager.playTaskCompleted();
                                    onToggleTask(task.id);
                                  }}
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                                    task.completed
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'border-slate-300 dark:border-slate-600'
                                  }`}
                                >
                                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </button>
                                <div className="min-w-0">
                                  <h4
                                    className={`text-xs font-bold truncate ${
                                      task.completed
                                        ? 'line-through text-slate-400 dark:text-slate-500'
                                        : 'text-slate-900 dark:text-white'
                                    }`}
                                  >
                                    {task.title}
                                  </h4>
                                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                    <span className="tabular-nums font-medium">
                                      {task.startTime} - {task.endTime}
                                    </span>
                                    <span>·</span>
                                    <span className={`inline-flex items-center gap-1 font-medium ${cat.textColor}`}>
                                      <CategoryIcon category={task.category} className="w-3 h-3" />
                                      {cat.nameUz}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  soundManager.playTap();
                                  onStartPomodoro(task);
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors flex-shrink-0"
                                title="Fokusni boshlash"
                              >
                                <Play className="w-3 h-3 fill-current" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
