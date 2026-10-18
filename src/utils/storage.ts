import { Task, Habit } from '../types';
import { getTodayYMD, formatDateToYMD } from './dateUtils';

const TASKS_STORAGE_KEY = 'rejakun_tasks_v2';
const HABITS_STORAGE_KEY = 'rejakun_habits_v2';
const SETTINGS_STORAGE_KEY = 'rejakun_settings_v2';

export function getInitialTasks(): Task[] {
  const today = getTodayYMD();
  
  // Tomorrow's date
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = formatDateToYMD(tomorrowDate);

  return [
    {
      id: 'task-1',
      title: 'Kunlik asosiy maqsadlar va rejani ko\'rish',
      description: 'Kun davomida eng muhim 3 ta natijani aniqlab olish va vaqt taqsimlash.',
      date: today,
      startTime: '08:30',
      endTime: '09:00',
      priority: 'high',
      category: 'personal',
      completed: true,
      subtasks: [
        { id: 'sub-1', title: 'Top-3 vazifani yozib olish', completed: true },
        { id: 'sub-2', title: 'Pochta va xabarlarni saralash', completed: true }
      ],
      reminder: true,
      pomodoroSessions: 1
    },
    {
      id: 'task-2',
      title: 'Loyiha hisoboti va taqdimotini yakunlash',
      description: 'Boshqaruv uchun oylik ko\'rsatkichlar va grafiklar tayyorlash.',
      date: today,
      startTime: '09:30',
      endTime: '11:00',
      priority: 'high',
      category: 'work',
      completed: false,
      subtasks: [
        { id: 'sub-3', title: 'Statistika ma\'lumotlarini yangilash', completed: true },
        { id: 'sub-4', title: 'Slaydlarni ko\'rib chiqish', completed: false },
        { id: 'sub-5', title: 'PDF formatda eksport qilish', completed: false }
      ],
      reminder: true,
      pomodoroSessions: 2
    },
    {
      id: 'task-3',
      title: 'Ingliz tili darsi: Speaking & Listening',
      description: '30 daqiqa podkast tinglash va 15 ta yangi so\'z birikmasini yodlash.',
      date: today,
      startTime: '11:30',
      endTime: '12:30',
      priority: 'medium',
      category: 'study',
      completed: false,
      subtasks: [],
      reminder: true,
      pomodoroSessions: 1
    },
    {
      id: 'task-4',
      title: 'Tushlik va qisqa piyoda sayr',
      description: 'Toza havoda nafas olish va miyani dam oldirish.',
      date: today,
      startTime: '13:00',
      endTime: '14:00',
      priority: 'low',
      category: 'health',
      completed: false,
      subtasks: [],
      reminder: false
    },
    {
      id: 'task-5',
      title: 'Jamoa bilan haftalik "Sync" yig\'ilishi',
      description: 'Bajarilgan ishlar hisoboti va keyingi bosqich rejasi muhokamasi.',
      date: today,
      startTime: '15:00',
      endTime: '16:00',
      priority: 'high',
      category: 'work',
      completed: false,
      subtasks: [
        { id: 'sub-6', title: 'Qaydlar protokolini yozib borish', completed: false }
      ],
      reminder: true,
      pomodoroSessions: 1
    },
    {
      id: 'task-6',
      title: 'Fitnes zal: Kardio va cho\'zilish mashqlari',
      description: '5 km yugurish, dumbbell mashqlari va sauna.',
      date: today,
      startTime: '17:30',
      endTime: '19:00',
      priority: 'medium',
      category: 'health',
      completed: false,
      subtasks: [],
      reminder: true
    },
    {
      id: 'task-7',
      title: 'Moliya va kundalik xarajatlarni kiritish',
      description: 'Kunlik cheklar va bank ilovasidagi xarajatlarni qayd etish.',
      date: today,
      startTime: '20:30',
      endTime: '21:00',
      priority: 'low',
      category: 'finance',
      completed: false,
      subtasks: [],
      reminder: false
    },
    {
      id: 'task-8',
      title: 'Kitob mutolaasi: "Atom Odatlar" - Jeyms Klir',
      description: '4-bobni o\'qish va foydali konspekt olish.',
      date: today,
      startTime: '21:30',
      endTime: '22:15',
      priority: 'low',
      category: 'study',
      completed: false,
      subtasks: [],
      reminder: true,
      pomodoroSessions: 1
    },
    // Tomorrow preview task
    {
      id: 'task-9',
      title: 'Yangi loyiha bo\'yicha strategiya ishlab chiqish',
      description: 'Mijoz talablari va texnik topshiriqni tahlil qilish.',
      date: tomorrow,
      startTime: '10:00',
      endTime: '12:00',
      priority: 'high',
      category: 'work',
      completed: false,
      subtasks: [],
      reminder: true
    }
  ];
}

export function getInitialHabits(): Habit[] {
  const today = getTodayYMD();
  
  // Previous 2 days
  const d1 = new Date();
  d1.setDate(d1.getDate() - 1);
  const d2 = new Date();
  d2.setDate(d2.getDate() - 2);
  const d3 = new Date();
  d3.setDate(d3.getDate() - 3);

  const prev1 = formatDateToYMD(d1);
  const prev2 = formatDateToYMD(d2);
  const prev3 = formatDateToYMD(d3);

  return [
    {
      id: 'habit-1',
      title: '2 litr toza suv ichish',
      icon: 'Droplet',
      color: '#0284c7',
      category: 'health',
      completedDates: [today, prev1, prev2, prev3],
      streak: 4,
      targetPerWeek: 7
    },
    {
      id: 'habit-2',
      title: 'Ertalabki 15 daqiqa badantarbiya',
      icon: 'Activity',
      color: '#e11d48',
      category: 'health',
      completedDates: [today, prev1, prev2],
      streak: 3,
      targetPerWeek: 6
    },
    {
      id: 'habit-3',
      title: 'Kuniga 30 daqiqa kitob mutolaasi',
      icon: 'BookOpen',
      color: '#2563eb',
      category: 'study',
      completedDates: [prev1, prev2],
      streak: 2,
      targetPerWeek: 7
    },
    {
      id: 'habit-4',
      title: '10 ta yangi xorijiy so\'z o\'rganish',
      icon: 'Sparkles',
      color: '#7c3aed',
      category: 'study',
      completedDates: [prev1, prev2, prev3],
      streak: 3,
      targetPerWeek: 5
    },
    {
      id: 'habit-5',
      title: 'Uxlashdan oldin telefonsiz 30 daqiqa',
      icon: 'Moon',
      color: '#d97706',
      category: 'personal',
      completedDates: [prev1],
      streak: 1,
      targetPerWeek: 7
    }
  ];
}

export function loadSavedTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialTasks();
      saveTasks(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialTasks();
  }
}

export function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks', err);
  }
}

export function loadSavedHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(HABITS_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialHabits();
      saveHabits(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialHabits();
  }
}

export function saveHabits(habits: Habit[]) {
  try {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch (err) {
    console.error('Failed to save habits', err);
  }
}

export interface AppSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  mobileViewOnly: boolean; // Toggle between mobile frame simulation or full responsive layout on desktop
  pomodoroWorkMin: number;
  pomodoroShortBreakMin: number;
  pomodoroLongBreakMin: number;
}

export const defaultSettings: AppSettings = {
  darkMode: false,
  soundEnabled: true,
  mobileViewOnly: true,
  pomodoroWorkMin: 25,
  pomodoroShortBreakMin: 5,
  pomodoroLongBreakMin: 15,
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}
