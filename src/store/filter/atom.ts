import { atom } from 'recoil';

import { 鉢 } from 'src/domain/entity/鉢';

export type FilterState = {
  耐寒温度:
    | {
        start?: number;
        end?: number;
      }
    | undefined;
  日光の強度: 鉢.日光の強度 | undefined;
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
  export const isデフォルトのフィルタ条件 = (item: FilterState) => {
    if (item.耐寒温度) return false;
    if (item.日光の強度) return false;
    if (item.keyword) return false;
    if (item.最後の灌水からの経過日数) return false;
    return true;
  };
}

export const FILTER_STATE_ATOM = atom<FilterState>({
  key: 'Filter',
  default: FilterState.DEFAULT(),
});
