import { CategoryId, CategoryInfo } from '../types';

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  work: {
    id: 'work',
    nameUz: 'Ish & Loyihalar',
    icon: 'Briefcase',
    color: '#059669', // emerald-600
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    textColor: 'text-emerald-700 dark:text-emerald-300'
  },
  study: {
    id: 'study',
    nameUz: "Ta'lim & O'qish",
    icon: 'GraduationCap',
    color: '#2563eb', // blue-600
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    textColor: 'text-blue-700 dark:text-blue-300'
  },
  health: {
    id: 'health',
    nameUz: 'Sport & Soglik',
    icon: 'HeartPulse',
    color: '#e11d48', // rose-600
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    textColor: 'text-rose-700 dark:text-rose-300'
  },
  personal: {
    id: 'personal',
    nameUz: 'Shaxsiy rivojlanish',
    icon: 'Smile',
    color: '#d97706', // amber-600
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    textColor: 'text-amber-700 dark:text-amber-300'
  },
  finance: {
    id: 'finance',
    nameUz: 'Moliya & Byudjet',
    icon: 'Wallet',
    color: '#7c3aed', // violet-600
    bgColor: 'bg-violet-50 dark:bg-violet-950/40',
    textColor: 'text-violet-700 dark:text-violet-300'
  },
  home: {
    id: 'home',
    nameUz: 'Uy & Oila',
    icon: 'Home',
    color: '#0284c7', // sky-600
    bgColor: 'bg-sky-50 dark:bg-sky-950/40',
    textColor: 'text-sky-700 dark:text-sky-300'
  }
};

export const PRIORITY_LABELS: Record<string, { labelUz: string; color: string; badgeClass: string }> = {
  high: {
    labelUz: 'Yuqori',
    color: '#ef4444',
    badgeClass: 'text-rose-600 dark:text-rose-400 font-semibold'
  },
  medium: {
    labelUz: "O'rtacha",
    color: '#f59e0b',
    badgeClass: 'text-amber-600 dark:text-amber-400 font-medium'
  },
  low: {
    labelUz: 'Oddiy',
    color: '#10b981',
    badgeClass: 'text-emerald-600 dark:text-emerald-400 font-medium'
  }
};
