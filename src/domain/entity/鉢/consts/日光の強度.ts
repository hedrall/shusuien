import { ValueOf } from 'type-fest';

export const _日光の強度 = {
  直射日光: { name: '直射日光', 短縮表現: '直' },
  '20%遮光': { name: '20%遮光', 短縮表現: '-20%' },
  '30%遮光': { name: '30%遮光', 短縮表現: '-30%' },
  '40%遮光': { name: '40%遮光', 短縮表現: '-40%' },
  '50%遮光': { name: '50%遮光', 短縮表現: '-50%' },
  '60%遮光': { name: '60%遮光', 短縮表現: '-60%' },
  半日陰: { name: '半日陰', 短縮表現: '半日陰' },
} as const satisfies { [K in string]: { name: K; 短縮表現: string } };
export type _日光の強度 = ValueOf<typeof _日光の強度>['name'];
