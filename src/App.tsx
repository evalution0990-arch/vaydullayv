import React, { useState, useEffect } from 'react';
import {
  Task,
  Habit,
  TabType,
  CategoryId,
  Priority
} from './types';
import {
  loadSavedTasks,
  saveTasks,
  loadSavedHabits,
  saveHabits,
  loadSettings,
  saveSettings,
  getInitialTasks,
  getInitialHabits
} from './utils/storage';
import { getTodayYMD } from './utils/dateUtils';
import { soundManager } from './utils/audio';

import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { DateStrip } from './components/DateStrip';
import { TaskList } from './components/TaskList';
import { TimelineView } from './components/TimelineView';
import { HabitsView } from './components/HabitsView';
import { FocusTimer } from './components/FocusTimer';
import { StatsView } from './components/StatsView';
import { TaskModal } from './components/TaskModal';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadSavedTasks());
  const [habits, setHabits] = useState<Habit[]>(() => loadSavedHabits());
  const [settings, setSettings] = useState(() => loadSettings());

  const [selectedDate, setSelectedDate] = useState<string>(getTodayYMD());
  const [currentTab, setCurrentTab] = useState<TabType>('tasks');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Task Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalDefaultTime, setModalDefaultTime] = useState<string | undefined>(undefined);

  // Focus Timer active linked task
  const [focusSelectedTask, setFocusSelectedTask] = useState<Task | null>(null);

  // Apply dark mode to document HTML
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveSettings(settings);
    soundManager.isMuted = !settings.soundEnabled;
  }, [settings]);

  // Save tasks on change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Save habits on change
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  // Dark mode toggle
  const toggleDarkMode = () => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  // Sound toggle
  const toggleSound = () => {
    const nextVal = !settings.soundEnabled;
    soundManager.isMuted = !nextVal;
    if (nextVal) {
      soundManager.playTap();
    }
    setSettings((prev) => ({ ...prev, soundEnabled: nextVal }));
  };

  // Mobile frame mockup toggle
  const toggleMobileView = () => {
    setSettings((prev) => ({ ...prev, mobileViewOnly: !prev.mobileViewOnly }));
  };

  // Task Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
            subtasks: t.subtasks.map((s) => ({ ...s, completed: nextCompleted }))
          };
        }
        return t;
      })
    );
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          );
          const allDone = updatedSubtasks.every((s) => s.completed);
          return {
            ...t,
            subtasks: updatedSubtasks,
            completed: allDone
          };
        }
        return t;
      })
    );
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'>, taskId?: string) => {
    if (taskId) {
      // Editing existing task
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...taskData, id: taskId } : t))
      );
    } else {
      // Creating new task
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      };
      setTasks((prev) => [...prev, newTask]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Ushbu vazifani o'chirmoqchimisiz?")) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const handleOpenNewTaskModal = (defaultTime?: string) => {
    setEditingTask(null);
    setModalDefaultTime(defaultTime);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalDefaultTime(undefined);
    setIsTaskModalOpen(true);
  };

  const handleStartPomodoro = (task: Task) => {
    setFocusSelectedTask(task);
    setCurrentTab('focus');
  };

  const handleSessionComplete = (taskId?: string) => {
    if (taskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, pomodoroSessions: (t.pomodoroSessions || 0) + 1 }
            : t
        )
      );
    }
  };

  // Habit Handlers
  const handleToggleHabit = (habitId: string) => {
    const todayStr = getTodayYMD();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const hasToday = h.completedDates.includes(todayStr);
          let newDates: string[];
          let newStreak = h.streak;

          if (hasToday) {
            newDates = h.completedDates.filter((d) => d !== todayStr);
            newStreak = Math.max(0, h.streak - 1);
          } else {
            newDates = [...h.completedDates, todayStr];
            newStreak = h.streak + 1;
          }

          return {
            ...h,
            completedDates: newDates,
            streak: newStreak
          };
        }
        return h;
      })
    );
  };

  const handleAddHabit = (newHabitData: Omit<Habit, 'id' | 'completedDates' | 'streak'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit-${Date.now()}`,
      completedDates: [],
      streak: 0
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleDeleteHabit = (habitId: string) => {
    if (confirm("Ushbu odatni o'chirib tashlamoqchimisiz?")) {
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
    }
  };

  // Reset to initial demo data
  const handleResetData = () => {
    const initialTasks = getInitialTasks();
    const initialHabits = getInitialHabits();
    setTasks(initialTasks);
    setHabits(initialHabits);
    setSelectedDate(getTodayYMD());
    saveTasks(initialTasks);
    saveHabits(initialHabits);
  };

  const handleImportData = (imported: { tasks: Task[]; habits: Habit[] }) => {
    setTasks(imported.tasks);
    if (imported.habits) setHabits(imported.habits);
  };

  // Counts for header & badge
  const todayTasks = tasks.filter((t) => t.date === selectedDate);
  const completedTodayCount = todayTasks.filter((t) => t.completed).length;
  const pendingTasksCount = todayTasks.filter((t) => !t.completed).length;

  return (
    <MobileFrame
      isMobileMockup={settings.mobileViewOnly}
      onToggleMockup={toggleMobileView}
    >
      <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative text-slate-800 dark:text-slate-100">
        {/* Top Header */}
        <Header
          darkMode={settings.darkMode}
          onToggleDarkMode={toggleDarkMode}
          soundEnabled={settings.soundEnabled}
          onToggleSound={toggleSound}
          mobileViewOnly={settings.mobileViewOnly}
          onToggleMobileView={toggleMobileView}
          isSearchOpen={isSearchOpen}
          onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          completedTodayCount={completedTodayCount}
          totalTodayCount={todayTasks.length}
        />

        {/* Date Selector Strip (shown on Tasks and Timeline tabs) */}
        {(currentTab === 'tasks' || currentTab === 'timeline') && (
          <DateStrip
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            tasks={tasks}
          />
        )}

        {/* Tab Views */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {currentTab === 'tasks' && (
            <TaskList
              tasks={tasks}
              selectedDate={selectedDate}
              onToggleTask={handleToggleTask}
              onToggleSubtask={handleToggleSubtask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onOpenNewTaskModal={handleOpenNewTaskModal}
              onStartPomodoro={handleStartPomodoro}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'timeline' && (
            <TimelineView
              tasks={tasks}
              selectedDate={selectedDate}
              onOpenNewTaskModal={handleOpenNewTaskModal}
              onToggleTask={handleToggleTask}
              onStartPomodoro={handleStartPomodoro}
            />
          )}

          {currentTab === 'habits' && (
            <HabitsView
              habits={habits}
              onToggleHabit={handleToggleHabit}
              onAddHabit={handleAddHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          )}

          {currentTab === 'focus' && (
            <FocusTimer
              tasks={todayTasks}
              selectedTask={focusSelectedTask}
              onSelectTask={setFocusSelectedTask}
              onSessionComplete={handleSessionComplete}
            />
          )}

          {currentTab === 'stats' && (
            <StatsView
              tasks={tasks}
              habits={habits}
              onResetData={handleResetData}
              onImportData={handleImportData}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onQuickAdd={() => handleOpenNewTaskModal()}
          unreadCount={pendingTasksCount}
        />

        {/* New / Edit Task Modal Drawer */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSaveTask={handleSaveTask}
          editingTask={editingTask}
          defaultDate={selectedDate}
          defaultTime={modalDefaultTime}
        />
      </div>
    </MobileFrame>
  );
}
