import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  Coffee,
  Brain,
  CloudRain,
  Radio,
  Sparkles
} from 'lucide-react';
import { Task } from '../types';
import { soundManager } from '../utils/audio';

interface FocusTimerProps {
  tasks: Task[];
  selectedTask?: Task | null;
  onSelectTask: (task: Task | null) => void;
  onSessionComplete: (taskId?: string) => void;
}

type Mode = 'work' | 'shortBreak' | 'longBreak';
type AmbientSound = 'none' | 'rain' | 'whitenoise' | 'campfire';

export const FocusTimer: React.FC<FocusTimerProps> = ({
  tasks,
  selectedTask,
  onSelectTask,
  onSessionComplete
}) => {
  const [mode, setMode] = useState<Mode>('work');
  const [workMinutes, setWorkMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);

  const getDurationForMode = (m: Mode) => {
    if (m === 'work') return workMinutes * 60;
    if (m === 'shortBreak') return shortBreakMinutes * 60;
    return longBreakMinutes * 60;
  };

  const [timeLeft, setTimeLeft] = useState(getDurationForMode(mode));
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(3);
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('none');
  const [ambientVol, setAmbientVol] = useState(0.2);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync time left when mode changes
  useEffect(() => {
    setTimeLeft(getDurationForMode(mode));
    setIsActive(false);
  }, [mode, workMinutes, shortBreakMinutes, longBreakMinutes]);

  // Main countdown loop
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode]);

  // Ambient sound management
  useEffect(() => {
    if (ambientSound === 'none' || !isActive) {
      soundManager.stopAmbient();
    } else {
      soundManager.startAmbient(ambientSound, ambientVol);
    }

    return () => {
      soundManager.stopAmbient();
    };
  }, [ambientSound, isActive, ambientVol]);

  const handleTimerComplete = () => {
    setIsActive(false);
    soundManager.playTimerBell();

    if (mode === 'work') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      setCompletedSessions((prev) => prev + 1);
      onSessionComplete(selectedTask?.id);
      setMode('shortBreak');
    } else {
      setMode('work');
    }
  };

  const toggleTimer = () => {
    soundManager.playTap();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    soundManager.playTap();
    setIsActive(false);
    setTimeLeft(getDurationForMode(mode));
  };

  const switchMode = (m: Mode) => {
    soundManager.playTap();
    setMode(m);
  };

  const totalDuration = getDurationForMode(mode);
  const progressPercent = totalDuration > 0 ? (1 - timeLeft / totalDuration) : 0;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG circle calculations
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressPercent * circumference;

  return (
    <div className="flex-1 pb-24 overflow-y-auto">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Fokus & Pomodoro taymeri
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Diqqatni bir joyga jamlang va chalg'imasdan ishlang.
        </p>

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mt-3">
          <button
            onClick={() => switchMode('work')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'work'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Fokus ({workMinutes}d)</span>
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Qisqa dam ({shortBreakMinutes}d)</span>
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'longBreak'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Uzoq dam ({longBreakMinutes}d)</span>
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="p-6 flex flex-col items-center">
        {/* SVG Circular Progress Ring */}
        <div className="relative w-64 h-64 flex items-center justify-center my-2">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
            {/* Background Track */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              className="stroke-emerald-500 transition-all duration-500 ease-linear"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {timeFormatted}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-wider">
              {mode === 'work' ? 'Fokus vaqti' : 'Dam olish'}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Bugun {completedSessions} ta sessiya
            </span>
          </div>
        </div>

        {/* Controls: Start/Pause & Reset */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={resetTimer}
            className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Qayta o'rnatish"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className={`h-14 px-8 rounded-2xl font-bold text-base flex items-center gap-2.5 shadow-lg transition-transform active:scale-95 ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>To'xtatib turish</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Boshlash</span>
              </>
            )}
          </button>
        </div>

        {/* Selected Task Target */}
        <div className="w-full max-w-sm mt-8 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Qaysi vazifa ustida ishlayapsiz?
            </span>
            {selectedTask && (
              <button
                onClick={() => onSelectTask(null)}
                className="text-[11px] text-slate-400 hover:text-slate-600"
              >
                Bekor qilish
              </button>
            )}
          </div>

          <select
            value={selectedTask?.id || ''}
            onChange={(e) => {
              const task = tasks.find((t) => t.id === e.target.value) || null;
              onSelectTask(task);
            }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Umumiy ish / Tanlanmagan</option>
            {tasks
              .filter((t) => !t.completed)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.startTime} - {t.endTime})
                </option>
              ))}
          </select>
        </div>

        {/* Ambient Sounds for Focus */}
        <div className="w-full max-w-sm mt-4 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Fokus uchun sokin fon ovozi (Web Audio)
          </span>

          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'none', label: "O'chirilgan", icon: VolumeX },
              { id: 'rain', label: "Yomg'ir", icon: CloudRain },
              { id: 'whitenoise', label: 'Shovqin', icon: Radio },
              { id: 'campfire', label: 'Gulxan', icon: Flame }
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = ambientSound === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundManager.playTap();
                    setAmbientSound(item.id as AmbientSound);
                  }}
                  className={`py-2 px-1 rounded-xl text-center flex flex-col items-center gap-1 border transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>

          {ambientSound !== 'none' && (
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={ambientVol}
                onChange={(e) => setAmbientVol(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
