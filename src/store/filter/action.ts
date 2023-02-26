import { selector, useRecoilState } from 'recoil';
import { FILTER_STATE_ATOM, FilterState } from '@frontend/store/filter/atom';
import { 日光の強度 } from '@frontend/domain/model/item';

const FilterSelector = selector<FilterState>({
  key: 'FilterStateSelector',
  get: ({ get }) => get(FILTER_STATE_ATOM),
  set: ({ set }, items) => {
    set(FILTER_STATE_ATOM, pre => {
      return {
        ...pre,
        ...items,
      };
    });
  },
});

export const useFilter = () => {
  const [state, set] = useRecoilState(FilterSelector);

  return {
    filter: state,
    set: {
      耐寒温度: (start: number | undefined, end: number | undefined) =>
        set(pre => ({ ...pre, 耐寒温度: { start, end } })),
      日光の強度: (v?: 日光の強度) => set(pre => ({ ...pre, 日光の強度: v })),
      keyword: (v?: string) => set(pre => ({ ...pre, keyword: v })),
      最後の灌水からの経過日数: (v: number | undefined) => {
        console.log({ update: v });
        set(pre => ({ ...pre, 最後の灌水からの経過日数: { start: v } }));
      },
      clear: () => set(FilterState.DEFAULT()),
    },
  };
};
