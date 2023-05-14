import { atom } from 'recoil';

export type 灌水時の施肥有無設定 = {
  ON: boolean;
};

export const 灌水時の施肥有無設定 = atom<灌水時の施肥有無設定>({
  key: '灌水時の施肥有無設定',
  default: { ON: false },
});
