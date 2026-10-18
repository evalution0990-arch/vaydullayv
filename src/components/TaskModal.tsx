import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock, Calendar, Check, Bell } from 'lucide-react';
import { Task, CategoryId, Priority, Subtask } from '../types';
import { CATEGORIES, PRIORITY_LABELS } from '../utils/categories';
import { getTodayYMD, formatDateToYMD } from '../utils/dateUtils';
import { soundManager } from '../utils/audio';
import { CategoryIcon } from './CategoryIcon';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (taskData: Omit<Task, 'id'>, taskId?: string) => void;
  editingTask?: Task | null;
  defaultDate: string;
  defaultTime?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  editingTask,
  defaultDate,
  defaultTime
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState(defaultTime || '09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<CategoryId>('work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [reminder, setReminder] = useState(true);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Populate or reset form
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setDate(editingTask.date);
      setStartTime(editingTask.startTime);
      setEndTime(editingTask.endTime);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setReminder(editingTask.reminder ?? true);
      setSubtasks(editingTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setDate(defaultDate || getTodayYMD());
      if (defaultTime) {
        setStartTime(defaultTime);
        const [h, m] = defaultTime.split(':').map(Number);
        const nextH = Math.min(23, (h || 0) + 1);
        setEndTime(`${String(nextH).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`);
      } else {
        setStartTime('09:30');
        setEndTime('10:30');
      }
      setCategory('work');
      setPriority('medium');
      setReminder(true);
      setSubtasks([]);
    }
  }, [editingTask, defaultDate, defaultTime, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    soundManager.playTap();
    const newSub: Subtask = {
      id: `sub-${Date.now()}-${Math.random()}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    soundManager.playTap();
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundManager.playTap();
    onSaveTask(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        startTime,
        endTime,
        category,
        priority,
        completed: editingTask ? editingTask.completed : false,
        subtasks,
        reminder,
        pomodoroSessions: editingTask?.pomodoroSessions || 0
      },
      editingTask?.id
    );
    onClose();
  };

  // Quick helper for setting date to today or tomorrow
  const setQuickDate = (type: 'today' | 'tomorrow') => {
    soundManager.playTap();
    if (type === 'today') {
      setDate(getTodayYMD());
    } else {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      setDate(formatDateToYMD(d));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle */}
        <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto my-3 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {editingTask ? "Vazifani tahrirlash" : "Yangi vazifa qo'shish"}
          </h3>
          <button
            onClick={() => {
              soundManager.playTap();
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Vazifa nomi *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Yangi dastur taqdimotini tayyorlash"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Batafsil izoh yoki topshiriqlar
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Qo'shimcha eslatmalar yoki reja tafsilotlari..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Date Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Sana
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQuickDate('today')}
                  className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200"
                >
                  Bugun
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate('tomorrow')}
                  className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200"
                >
                  Ertaga
                </button>
              </div>
            </div>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Time Block: Start & End */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Boshlanish vaqti
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tugash vaqti
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums font-medium"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Toifa (Kategoriya)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(CATEGORIES) as CategoryId[]).map((catId) => {
                const cat = CATEGORIES[catId];
                const isSelected = category === catId;
                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setCategory(catId);
                    }}
                    className={`py-2 px-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CategoryIcon category={catId} className="w-3.5 h-3.5" />
                    <span className="truncate">{cat.nameUz}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Muhimlik darajasi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'high', label: 'Yuqori', color: 'text-rose-600 border-rose-200 dark:border-rose-900/60' },
                { id: 'medium', label: "O'rtacha", color: 'text-amber-600 border-amber-200 dark:border-amber-900/60' },
                { id: 'low', label: 'Oddiy', color: 'text-emerald-600 border-emerald-200 dark:border-emerald-900/60' }
              ].map((p) => {
                const isSelected = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      soundManager.playTap();
                      setPriority(p.id as Priority);
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtasks / Checklist */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kichik bosqichlar (Cheklist)
            </label>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <span className="text-slate-800 dark:text-slate-200 truncate">
                      {sub.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Yangi bosqichni yozing..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Qo'shish
              </button>
            </div>
          </div>

          {/* Reminder Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Eslatma bildirishnomasi
                </span>
                <span className="text-[10px] text-slate-400">
                  Boshlanishidan oldin ogohlantirish
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                setReminder(!reminder);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                reminder ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  reminder ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                soundManager.playTap();
                onClose();
              }}
              className="flex-1 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              {editingTask ? "O'zgarishlarni saqlash" : "Vazifani yaratish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
