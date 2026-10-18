import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  Edit2,
  Trash2,
  Plus,
  ListTodo,
  CheckCircle2,
  Flame,
  AlertCircle
} from 'lucide-react';
import { Task, CategoryId, FilterType, Priority } from '../types';
import { CATEGORIES, PRIORITY_LABELS } from '../utils/categories';
import { soundManager } from '../utils/audio';
import { CategoryIcon } from './CategoryIcon';
import { getRelativeDayLabel, formatUzbekFullDate } from '../utils/dateUtils';

interface TaskListProps {
  tasks: Task[];
  selectedDate: string;
  onToggleTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNewTaskModal: (defaultTime?: string) => void;
  onStartPomodoro: (task: Task) => void;
  searchQuery: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedDate,
  onToggleTask,
  onToggleSubtask,
  onEditTask,
  onDeleteTask,
  onOpenNewTaskModal,
  onStartPomodoro,
  searchQuery
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({});

  // Filter tasks by date
  const dayTasks = tasks.filter((t) => t.date === selectedDate);

  // Apply search query
  let filtered = dayTasks;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }

  // Apply Category filter
  if (activeCategory !== 'all') {
    filtered = filtered.filter((t) => t.category === activeCategory);
  }

  // Apply Status filter
  if (statusFilter === 'active') {
    filtered = filtered.filter((t) => !t.completed);
  } else if (statusFilter === 'completed') {
    filtered = filtered.filter((t) => t.completed);
  }

  // Sort: by start time
  filtered.sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Completion stats
  const totalTasks = dayTasks.length;
  const completedTasks = dayTasks.filter((t) => t.completed).length;
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleTaskCheck = (task: Task) => {
    if (!task.completed) {
      soundManager.playTaskCompleted();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#059669', '#34d399', '#6ee7b7']
      });
    } else {
      soundManager.playTap();
    }
    onToggleTask(task.id);
  };

  const toggleSubtasksExpand = (taskId: string) => {
    soundManager.playTap();
    setExpandedSubtasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const dayLabel = getRelativeDayLabel(selectedDate);
  const formattedFullDate = formatUzbekFullDate(selectedDate);

  return (
    <div className="flex-1 pb-24 overflow-y-auto">
      {/* Day Overview Banner */}
      <div className="p-4 bg-gradient-to-b from-white to-slate-50/60 dark:from-slate-900 dark:to-slate-900/40 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {dayLabel}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formattedFullDate}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {totalTasks === 0
                ? 'Rejalar mavjud emas'
                : `${totalTasks} ta vazifadan ${completedTasks} tasi bajarildi`}
            </h2>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => {
              soundManager.playTap();
              onOpenNewTaskModal();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Qo'shish</span>
          </button>
        </div>

        {/* Progress Bar */}
        {totalTasks > 0 && (
          <div className="mt-3">
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Samaradorlik: {percent}%</span>
              <span>
                {totalTasks - completedTasks} ta kutilmoqda
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Segmented Filter Control & Category Scroller */}
      <div className="sticky top-[57px] z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 py-2.5 px-4 space-y-2">
        {/* Status Filters */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl">
          <button
            onClick={() => {
              soundManager.playTap();
              setStatusFilter('all');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Barchasi ({dayTasks.length})
          </button>
          <button
            onClick={() => {
              soundManager.playTap();
              setStatusFilter('active');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'active'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Kutilmoqda ({dayTasks.filter((t) => !t.completed).length})
          </button>
          <button
            onClick={() => {
              soundManager.playTap();
              setStatusFilter('completed');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'completed'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Bajarilgan ({completedTasks})
          </button>
        </div>

        {/* Category horizontal scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => {
              soundManager.playTap();
              setActiveCategory('all');
            }}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Barcha toifalar
          </button>

          {(Object.keys(CATEGORIES) as CategoryId[]).map((catId) => {
            const cat = CATEGORIES[catId];
            const isSelected = activeCategory === catId;
            return (
              <button
                key={catId}
                onClick={() => {
                  soundManager.playTap();
                  setActiveCategory(catId);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <CategoryIcon category={catId} className="w-3.5 h-3.5" />
                <span>{cat.nameUz}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tasks List */}
      <div className="p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <ListTodo className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Vazifalar topilmadi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Ushbu filtr yoki kun uchun hali vazifalar kiritilmagan. Yangi vazifa qo'shib kuningizni unumli rejalashtiring!
            </p>
            <button
              onClick={() => {
                soundManager.playTap();
                onOpenNewTaskModal();
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi vazifa qo'shish</span>
            </button>
          </div>
        ) : (
          filtered.map((task) => {
            const cat = CATEGORIES[task.category] || CATEGORIES.work;
            const priorityInfo = PRIORITY_LABELS[task.priority] || PRIORITY_LABELS.medium;
            const hasSubtasks = task.subtasks && task.subtasks.length > 0;
            const completedSubCount = hasSubtasks
              ? task.subtasks.filter((s) => s.completed).length
              : 0;
            const isExpanded = !!expandedSubtasks[task.id];

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                  task.completed
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                    : 'bg-white dark:bg-slate-850 dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Custom Checkbox (Touch target >= 44x44px wrapper) */}
                  <div className="flex items-center justify-center -ml-1 -mt-1 w-11 h-11 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTaskCheck(task)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 bg-white dark:bg-slate-800'
                      }`}
                      aria-label="Vazifani bajarildi deb belgilash"
                    >
                      {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Time */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                        <Clock className="w-3 h-3" />
                        {task.startTime} - {task.endTime}
                      </span>

                      <span className="text-slate-300 dark:text-slate-700">·</span>

                      {/* Category Label (Clean unboxed text) */}
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${cat.textColor}`}>
                        <CategoryIcon category={task.category} className="w-3 h-3" />
                        {cat.nameUz}
                      </span>

                      <span className="text-slate-300 dark:text-slate-700">·</span>

                      {/* Priority */}
                      <span className={`text-[11px] ${priorityInfo.badgeClass}`}>
                        {priorityInfo.labelUz}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-sm font-semibold mt-1 leading-snug break-words ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h3>

                    {/* Description */}
                    {task.description && (
                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          task.completed
                            ? 'text-slate-400 dark:text-slate-500'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {task.description}
                      </p>
                    )}

                    {/* Subtasks Accordion Trigger */}
                    {hasSubtasks && (
                      <div className="mt-2.5">
                        <button
                          type="button"
                          onClick={() => toggleSubtasksExpand(task.id)}
                          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        >
                          <span className="font-medium">
                            Kichik vazifalar ({completedSubCount}/{task.subtasks.length})
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Subtasks List */}
                        {isExpanded && (
                          <div className="mt-2 pl-2 space-y-1.5 border-l-2 border-slate-200 dark:border-slate-800">
                            {task.subtasks.map((sub) => (
                              <div
                                key={sub.id}
                                onClick={() => {
                                  soundManager.playTap();
                                  onToggleSubtask(task.id, sub.id);
                                }}
                                className="flex items-center gap-2 cursor-pointer group py-0.5"
                              >
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                    sub.completed
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'border-slate-300 dark:border-slate-600 group-hover:border-emerald-500'
                                  }`}
                                >
                                  {sub.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </div>
                                <span
                                  className={`text-xs ${
                                    sub.completed
                                      ? 'line-through text-slate-400 dark:text-slate-500'
                                      : 'text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  {sub.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Card Actions */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                      {/* Left: Pomodoro Trigger */}
                      <button
                        onClick={() => {
                          soundManager.playTap();
                          onStartPomodoro(task);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors"
                        title="Ushbu vazifa uchun Pomodoro fokus taymerini yoqish"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Fokus taymeri</span>
                      </button>

                      {/* Right: Edit & Delete buttons with min-44px touch container */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            soundManager.playTap();
                            onEditTask(task);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            soundManager.playTap();
                            onDeleteTask(task.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
