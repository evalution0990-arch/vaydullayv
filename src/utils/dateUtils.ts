// Date utilities with Uzbek localization

export const UZ_MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

export const UZ_DAYS = [
  'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'
];

export const UZ_DAYS_SHORT = [
  'Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'
];

export function formatDateToYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseYMD(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function getTodayYMD(): string {
  return formatDateToYMD(new Date());
}

export function getRelativeDayLabel(dateStr: string): string {
  const todayStr = getTodayYMD();
  if (dateStr === todayStr) return 'Bugun';

  const today = parseYMD(todayStr);
  const target = parseYMD(dateStr);
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 1) return 'Ertaga';
  if (diffDays === -1) return 'Kecha';

  const d = parseYMD(dateStr);
  return `${d.getDate()} ${UZ_MONTHS[d.getMonth()]}`;
}

export function formatUzbekFullDate(dateStr: string): string {
  const d = parseYMD(dateStr);
  const dayName = UZ_DAYS[d.getDay()];
  const monthName = UZ_MONTHS[d.getMonth()];
  return `${dayName}, ${d.getDate()}-${monthName}`;
}

// Generate an array of dates around the selected date (e.g. 14 days)
export function getDaysWindow(centerDateStr: string, beforeDays: number = 7, afterDays: number = 14): {
  dateStr: string;
  dayNameShort: string;
  dayNumber: number;
  monthName: string;
  isToday: boolean;
}[] {
  const centerDate = parseYMD(centerDateStr);
  const todayStr = getTodayYMD();
  const list = [];

  for (let i = -beforeDays; i <= afterDays; i++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + i);
    const dateStr = formatDateToYMD(d);
    list.push({
      dateStr,
      dayNameShort: UZ_DAYS_SHORT[d.getDay()],
      dayNumber: d.getDate(),
      monthName: UZ_MONTHS[d.getMonth()],
      isToday: dateStr === todayStr,
    });
  }

  return list;
}

export function getTimeGreeting(): { greeting: string; icon: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) {
    return { greeting: 'Xayrli tong!', icon: 'Sun' };
  } else if (hour >= 11 && hour < 17) {
    return { greeting: 'Xayrli kun!', icon: 'SunMedium' };
  } else if (hour >= 17 && hour < 22) {
    return { greeting: 'Xayrli kech!', icon: 'Sunset' };
  } else {
    return { greeting: 'Xayrli tun!', icon: 'Moon' };
  }
}
