import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Trophy,
  X
} from 'lucide-react';
import { Habit, CategoryId } from '../types';
import { getTodayYMD, formatDateToYMD, parseYMD, UZ_DAYS_SHORT } from '../utils/dateUtils';
import { soundManager } from '../utils/audio';
import { CategoryIcon } from './CategoryIcon';

interface HabitsViewProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => void;
  onDeleteHabit: (habitId: string) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIcon, setNewIcon] = useState('Sparkles');
  const [newCategory, setNewCategory] = useState<CategoryId>('health');
  const [newTarget, setNewTarget] = useState(7);

  const todayStr = getTodayYMD();

  // Generate last 7 days for the weekly dot matrix
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: formatDateToYMD(d),
      dayNameShort: UZ_DAYS_SHORT[d.getDay()],
      isToday: formatDateToYMD(d) === todayStr
    };
  });

  const handleToggle = (habit: Habit) => {
    const isCompletedToday = habit.completedDates.includes(todayStr);
    if (!isCompletedToday) {
      soundManager.playTaskCompleted();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#059669', '#10b981', '#f59e0b', '#3b82f6']
      });
    } else {
      soundManager.playTap();
    }
    onToggleHabit(habit.id);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundManager.playTap();
    onAddHabit({
      title: newTitle.trim(),
      icon: newIcon,
      color: '#10b981',
      category: newCategory,
      targetPerWeek: Number(newTarget) || 7
    });

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const completedTodayCount = habits.filter((h) => h.completedDates.includes(todayStr)).length;

  return (
    <div className="flex-1 pb-24 overflow-y-auto">
      {/* Habits Header Card */}
      <div className="p-4 bg-gradient-to-b from-white to-slate-50/60 dark:from-slate-900 dark:to-slate-900/40 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Kunlik intizom va odatlar</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {completedTodayCount}/{habits.length} odat bajarildi
            </h2>
          </div>

          <button
            onClick={() => {
              soundManager.playTap();
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi odat</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Kichik muntazam harakatlar katta natijalarga yetaklaydi.
        </p>
      </div>

      {/* Habits List */}
      <div className="p-4 space-y-3">
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Hali odatlar qo'shilmagan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Kunlik odatlaringizni belgilang va ketma-ketlikni saqlab boring.
            </p>
          </div>
        ) : (
          habits.map((habit) => {
            const isCompletedToday = habit.completedDates.includes(todayStr);

            return (
              <div
                key={habit.id}
                className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Icon & Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isCompletedToday
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <CategoryIcon iconName={habit.icon} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {habit.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="tabular-nums">{habit.streak}</span> kunlik
                        </span>
                        <span>·</span>
                        <span>Haftada {habit.targetPerWeek} kun</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Check Button (Min 44x44px hitbox) */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleToggle(habit)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                        isCompletedToday
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700'
                      }`}
                      title={isCompletedToday ? "Bajarildi (Qaytarish)" : "Bugun bajarildi deb belgilash"}
                    >
                      <Check className={`w-5 h-5 stroke-[2.5] ${isCompletedToday ? 'text-white' : ''}`} />
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playTap();
                        onDeleteHabit(habit.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 7-Day History Trail */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">So'nggi 7 kun:</span>
                  <div className="flex items-center gap-1.5">
                    {past7Days.map((day) => {
                      const done = habit.completedDates.includes(day.dateStr);
                      return (
                        <div
                          key={day.dateStr}
                          className="flex flex-col items-center gap-1"
                        >
                          <span className="text-[9px] text-slate-400 font-medium">
                            {day.dayNameShort}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                              done
                                ? 'bg-emerald-500 text-white shadow-2xs'
                                : day.isToday
                                ? 'border border-dashed border-emerald-400 dark:border-emerald-600 text-slate-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            {done ? <Check className="w-3 h-3 stroke-[3]" /> : '·'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Habit Modal Sheet */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
            {/* Grab handle */}
            <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Yangi foydali odat qo'shish
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Odat nomi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Har kuni 20 daqiqa yugurish"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Belgi (Ikonka)
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    { icon: 'Droplet', label: 'Suv' },
                    { icon: 'BookOpen', label: 'Kitob' },
                    { icon: 'Activity', label: 'Sport' },
                    { icon: 'Sparkles', label: 'Rivoj' },
                    { icon: 'Moon', label: 'Uyqu' },
                    { icon: 'HeartPulse', label: 'Salomatlik' }
                  ].map((item) => (
                    <button
                      key={item.icon}
                      type="button"
                      onClick={() => setNewIcon(item.icon)}
                      className={`h-11 rounded-xl flex items-center justify-center border transition-all ${
                        newIcon === item.icon
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <CategoryIcon iconName={item.icon} className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly Target */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Haftalik maqsad: {newTarget} kun
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                  <span>1 kun</span>
                  <span>Har kuni (7 kun)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                >
                  Odatni saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
