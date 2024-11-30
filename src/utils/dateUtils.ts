import { startOfWeek, endOfWeek, startOfDay, endOfDay, isWithinInterval, subWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { PointTransaction } from '../types';

export function getWeeklyPoints(transactions: PointTransaction[], userId: string): number {
  const now = new Date();
  const weekStart = startOfWeek(now, { locale: ja });
  const weekEnd = endOfWeek(now, { locale: ja });

  return transactions
    .filter(t => 
      t.workerId === userId &&
      t.type === 'add' &&
      isWithinInterval(new Date(t.timestamp), { start: weekStart, end: weekEnd })
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getPreviousWeekPoints(transactions: PointTransaction[], userId: string): number {
  const now = new Date();
  const prevWeekStart = startOfWeek(subWeeks(now, 1), { locale: ja });
  const prevWeekEnd = endOfWeek(subWeeks(now, 1), { locale: ja });

  return transactions
    .filter(t => 
      t.workerId === userId &&
      t.type === 'add' &&
      isWithinInterval(new Date(t.timestamp), { start: prevWeekStart, end: prevWeekEnd })
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getDailyPoints(transactions: PointTransaction[], userId: string): { [key: string]: number } {
  const now = new Date();
  const weekStart = startOfWeek(now, { locale: ja });
  const weekEnd = endOfWeek(now, { locale: ja });

  const dailyPoints: { [key: string]: number } = {
    '日': 0, '月': 0, '火': 0, '水': 0, '木': 0, '金': 0, '土': 0
  };

  transactions
    .filter(t => 
      t.workerId === userId &&
      t.type === 'add' &&
      isWithinInterval(new Date(t.timestamp), { start: weekStart, end: weekEnd })
    )
    .forEach(t => {
      const date = new Date(t.timestamp);
      const dayName = date.toLocaleDateString('ja-JP', { weekday: 'short' }).replace('曜', '');
      dailyPoints[dayName] += t.amount;
    });

  return dailyPoints;
}