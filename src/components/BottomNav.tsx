import React from 'react';
import {
  ListTodo,
  Clock,
  Flame,
  Brain,
  BarChart3,
  Plus
} from 'lucide-react';
import { TabType } from '../types';
import { soundManager } from '../utils/audio';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onQuickAdd: () => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onQuickAdd,
  unreadCount
}) => {
  const tabs = [
    { id: 'tasks' as TabType, label: 'Vazifalar', icon: ListTodo },
    { id: 'timeline' as TabType, label: 'Jadval', icon: Clock },
    { id: 'habits' as TabType, label: 'Odatlar', icon: Flame },
    { id: 'focus' as TabType, label: 'Fokus', icon: Brain },
    { id: 'stats' as TabType, label: 'Tahlil', icon: BarChart3 }
  ];

  const handleTabClick = (tabId: TabType) => {
    soundManager.playTap();
    onTabChange(tabId);
  };

  return (
    <>
      {/* Floating Action Button (FAB) for Quick Add - positioned ergonomically above the tab bar */}
      {(currentTab === 'tasks' || currentTab === 'timeline') && (
        <button
          onClick={() => {
            soundManager.playTap();
            onQuickAdd();
          }}
          className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-lg shadow-emerald-600/35 flex items-center justify-center transition-all duration-200"
          title="Yangi vazifa qo'shish"
          aria-label="Yangi vazifa qo'shish"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      )}

      {/* Fixed Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 max-w-full">
        <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors select-none ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                }`}
                aria-label={tab.label}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-150 ${
                      isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                    }`}
                  />
                  {tab.id === 'tasks' && unreadCount && unreadCount > 0 ? (
                    <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center tabular-nums">
                      {unreadCount}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] tracking-tight mt-1 leading-none truncate max-w-[64px]">
                  {tab.label}
                </span>

                {/* Subtle active pill indicator line */}
                {isActive && (
                  <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
