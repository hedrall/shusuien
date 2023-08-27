import { atom } from 'recoil';
import { 日光の強度 } from '@frontend/domain/model/鉢';

export type FilterState = {
  耐寒温度:
    | {
        start?: number;
        end?: number;
      }
    | undefined;
  日光の強度: 日光の強度 | undefined;
  keyword: string | undefined;
  最後の灌水からの経過日数:
    | {
        start?: number;
      }
    | undefined;
  enabled: boolean;
};
export namespace FilterState {
  export const DEFAULT = () => ({
    耐寒温度: undefined,
    日光の強度: undefined,
    keyword: undefined,
    最後の灌水からの経過日数: undefined,
    enabled: false,
  });
}

export const FILTER_STATE_ATOM = atom<FilterState>({
  key: 'Filter',
  default: FilterState.DEFAULT(),
});
