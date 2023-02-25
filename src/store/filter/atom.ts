import { atom } from 'recoil';
import { 日光の強度 } from '@frontend/domain/model/item';

export type FilterState = {
  耐寒温度?: {
    start?: number;
    end?: number;
  };
  日光の強度?: 日光の強度;
  keyword?: string;
  最後の灌水からの経過日数?: {
    start?: number;
  };
};

export const FILTER_STATE_ATOM = atom<FilterState>({
  key: 'Filter',
  default: {},
});
