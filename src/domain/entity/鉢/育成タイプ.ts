import { ValueOf } from 'type-fest';

export const 育成タイプ = {
  冬: '冬',
  春秋: '春秋',
  夏: '夏',
} as const;
export type 育成タイプ = ValueOf<typeof 育成タイプ>;
