import React, { useRef } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Flame,
  Clock,
  Download,
  Upload,
  RotateCcw,
  Layers,
  Award
} from 'lucide-react';
import { Task, Habit, CategoryId } from '../types';
import { CATEGORIES } from '../utils/categories';
import { getTodayYMD, formatDateToYMD, parseYMD, UZ_DAYS_SHORT } from '../utils/dateUtils';
import { soundManager } from '../utils/audio';
import { CategoryIcon } from './CategoryIcon';

interface StatsViewProps {
  tasks: Task[];
  habits: Habit[];
  onResetData: () => void;
  onImportData: (imported: { tasks: Task[]; habits: Habit[] }) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  tasks,
  habits,
  onResetData,
  onImportData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const todayStr = getTodayYMD();

  // Tasks statistics
  const todayTasks = tasks.filter((t) => t.date === todayStr);
  const totalToday = todayTasks.length;
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const todayRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const totalAllTime = tasks.length;
  const completedAllTime = tasks.filter((t) => t.completed).length;

  // Category distribution
  const categoryCounts: Record<CategoryId, number> = {
    work: 0,
    study: 0,
    health: 0,
    personal: 0,
    finance: 0,
    home: 0
  };

  tasks.forEach((t) => {
    if (categoryCounts[t.category] !== undefined) {
      categoryCounts[t.category]++;
    }
  });

  // Last 7 days completion chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = formatDateToYMD(d);
    const dayTasks = tasks.filter((t) => t.date === dateStr);
    const done = dayTasks.filter((t) => t.completed).length;
    const total = dayTasks.length;
    return {
      dateStr,
      dayShort: UZ_DAYS_SHORT[d.getDay()],
      total,
      done,
      rate: total > 0 ? Math.round((done / total) * 100) : 0
    };
  });

  const maxTasksInDay = Math.max(...last7Days.map((d) => d.total), 5);

  // Habits streak max
  const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;

  // Export JSON
  const handleExport = () => {
    soundManager.playTap();
    const data = {
      version: 2,
      exportedAt: new Date().toISOString(),
      tasks,
      habits
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rejakun-zaxira-${todayStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.tasks && Array.isArray(json.tasks)) {
          onImportData({
            tasks: json.tasks,
            habits: json.habits || []
          });
          soundManager.playTaskCompleted();
        }
      } catch {
        alert("Fayl noto'g'ri formatda. Iltimos, to'g'ri JSON fayl tanlang.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex-1 pb-24 overflow-y-auto">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Samaradorlik va Tahlil
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Vazifalar va odatlaringizning haftalik ko'rsatkichlari.
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Top 3 KPI Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* KPI 1 */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[11px] font-medium text-slate-400">Bugungi natija</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
              {todayRate}%
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              {completedToday}/{totalToday} bajarildi
            </span>
          </div>

          {/* KPI 2 */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[11px] font-medium text-slate-400">Jami vazifalar</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
              {completedAllTime}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {totalAllTime} tadan
            </span>
          </div>

          {/* KPI 3 */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[11px] font-medium text-slate-400">Eng yuqori odat</span>
            <div className="text-xl font-bold text-amber-500 mt-0.5 tabular-nums flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{maxStreak}</span>
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              kunlik ketma-ketlik
            </span>
          </div>
        </div>

        {/* Weekly Activity Bar Chart */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              So'nggi 7 kunlik faollik
            </h3>
            <span className="text-[11px] text-slate-400">Bajarilgan / Rejalashtirilgan</span>
          </div>

          <div className="h-36 flex items-end justify-between gap-2 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            {last7Days.map((d) => {
              const heightPercent = maxTasksInDay > 0 ? (d.total / maxTasksInDay) * 100 : 0;
              const doneHeightPercent = d.total > 0 ? (d.done / d.total) * 100 : 0;

              return (
                <div key={d.dateStr} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums mb-1">
                    {d.done}/{d.total}
                  </span>
                  <div
                    className="w-full max-w-[28px] bg-slate-100 dark:bg-slate-800 rounded-lg relative overflow-hidden flex flex-col justify-end transition-all"
                    style={{ height: `${Math.max(15, heightPercent)}%` }}
                  >
                    <div
                      className="bg-emerald-500 w-full rounded-lg transition-all duration-300"
                      style={{ height: `${doneHeightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
                    {d.dayShort}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
            Yo'nalishlar (Kategoriyalar) bo'yicha
          </h3>

          <div className="space-y-3">
            {(Object.keys(CATEGORIES) as CategoryId[]).map((catId) => {
              const cat = CATEGORIES[catId];
              const count = categoryCounts[catId] || 0;
              const percent = totalAllTime > 0 ? Math.round((count / totalAllTime) * 100) : 0;

              return (
                <div key={catId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <CategoryIcon category={catId} className="w-3.5 h-3.5" />
                      <span>{cat.nameUz}</span>
                    </span>
                    <span className="text-slate-400 font-medium tabular-nums">
                      {count} ta ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Backup & Data Actions */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Ma'lumotlar va Zaxira
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Zaxira yuklash</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Tiklash</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>

          <button
            onClick={() => {
              if (confirm("Namunaviy vazifalar va odatlarni qayta yuklamoqchimisiz?")) {
                onResetData();
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Namunaviy holatga qaytarish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
