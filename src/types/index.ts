export type Priority = 'high' | 'medium' | 'low';

export type CategoryId = 'work' | 'study' | 'personal' | 'health' | 'finance' | 'home';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  priority: Priority;
  category: CategoryId;
  completed: boolean;
  subtasks: Subtask[];
  reminder?: boolean;
  pomodoroSessions?: number;
  completedAt?: string;
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  color: string;
  category: CategoryId;
  completedDates: string[]; // List of YYYY-MM-DD strings
  streak: number;
  targetPerWeek: number;
}

export type TabType = 'tasks' | 'timeline' | 'habits' | 'focus' | 'stats';
export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'time' | 'priority' | 'title';

export interface CategoryInfo {
  id: CategoryId;
  nameUz: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
}
