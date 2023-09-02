import { atom } from 'recoil';

export type 棚の一括灌水State = {
  is灌水中: boolean;
};

// TODO: 一括灌水に変更?
export const 棚の一括灌水State = atom<棚の一括灌水State>({
  key: '棚の一括灌水',
  default: {
    is灌水中: false,
  },
});
