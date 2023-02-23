import { 今月 } from '@frontend/supports/date';
import { ValueOf } from 'type-fest';

export const 季節 = {
  春: '春',
  夏: '夏',
  秋: '秋',
  冬: '冬',
} as const;
export type 季節 = ValueOf<typeof 季節>;

const 季節設定 = {
  1: '冬',
  2: '冬',
  3: '春',
  4: '春',
  5: '春',
  6: '夏',
  7: '夏',
  8: '夏',
  9: '秋',
  10: '秋',
  11: '秋',
  12: '冬',
} satisfies Record<number, 季節>;

export const 現在の季節 = 季節設定[今月];
