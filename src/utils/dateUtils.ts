import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns';

export interface WeekData {
  weekStart: string;
  weekEnd: string;
  date: string; // Display date (start of week)
}

export function groupByWeek(data: Array<{ date: string }>): WeekData[] {
  const weekMap = new Map<string, { dates: string[] }>();

  data.forEach((item) => {
    const date = parseISO(item.date);
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    const weekKey = format(weekStart, 'yyyy-MM-dd');

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, { dates: [] });
    }
    weekMap.get(weekKey)!.dates.push(item.date);
  });

  return Array.from(weekMap.entries()).map(([weekStart]) => ({
    weekStart,
    weekEnd: format(endOfWeek(parseISO(weekStart), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    date: weekStart,
  }));
}

export function formatDate(dateString: string, period: 'day' | 'week'): string {
  const date = parseISO(dateString);
  if (period === 'week') {
    return format(date, 'dd/MM/yyyy');
  }
  return format(date, 'dd/MM/yyyy');
}

export function formatDateShort(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'dd MMM', { locale: undefined });
}

