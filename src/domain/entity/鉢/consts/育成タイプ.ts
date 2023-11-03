import { ValueOf } from 'type-fest';

export const _育成タイプ = {
  冬: '冬',
  春秋: '春秋',
  夏: '夏',
} as const;
export type _育成タイプ = ValueOf<typeof _育成タイプ>;
