import { Dayjs } from 'dayjs';

export const DATE_TIME_FORMAT = 'YYYY/MM/DD HH:mm:ss';
export const DATE_READONLY_FORMAT = 'YYYY年M月D日 H時';
export const x日前の表記 = (now: Dayjs, date: Dayjs) => {
  const days = now.diff(date, 'days');
  const weeks = now.diff(date, 'weeks');
  if (days === 0) return '本日';
  if (days === 1) return '昨日';
  if (days === 2) return 'おととい';
  if (weeks === 0) return `${days}日前`;
  const months = now.diff(date, 'months');
  if (months === 0) return `${weeks}週間前`;
  const years = now.diff(date, 'years');
  if (years === 0) return `${months}ヶ月前`;
  return `${years}年前`;
};
