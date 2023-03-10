import dayjs, { Dayjs } from 'dayjs';

export const DATE_TIME_FORMAT = 'YYYY/MM/DD HH:mm:ss';
export const DATE_READONLY_FORMAT = 'YYYY年M月D日 H時';
export const x日前の表記 = (
  _now: Dayjs,
  _date: Dayjs,
): {
  表記: string;
  日数: number;
} => {
  const now = _now.startOf('day');
  const date = _date.startOf('day');
  const days = now.diff(date, 'days');
  if (days === 0) return { 表記: '本日', 日数: days };
  if (days === 1) return { 表記: '昨日', 日数: days };
  const weeks = now.diff(date, 'weeks');
  // 21日までは 'x日前' で表示
  if (weeks <= 3) return { 表記: `${days}日前`, 日数: days };
  const months = now.diff(date, 'months');
  if (months === 0) return { 表記: `${weeks}週間前`, 日数: days };
  const years = now.diff(date, 'years');
  if (years === 0) return { 表記: `${months}ヶ月前`, 日数: days };
  return { 表記: `${years}年前`, 日数: days };
};
export const NOW = dayjs();
export const 今日 = dayjs().startOf('day');
export const 今月 = (NOW.month() + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
