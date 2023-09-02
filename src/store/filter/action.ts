import { selector, useRecoilState } from 'recoil';
import { FILTER_STATE_ATOM, FilterState } from '@frontend/store/filter/atom';
import { 日光の強度 } from '@frontend/domain/model/鉢';
import { isDefined } from '@frontend/supports/functions';

const isEmpty = (item: FilterState) => {
  const { enabled, ...rest } = item;
  return Object.values(rest).filter(Boolean).length === 0;
};
const FilterSelector = selector<FilterState>({
  key: 'FilterStateSelector',
  get: ({ get }) => get(FILTER_STATE_ATOM),
  set: ({ set }, _item) => {
    const item = _item as FilterState;
    set(FILTER_STATE_ATOM, pre => {
      console.log({ pre, item });
      return {
        ...pre,
        ...item,
        enabled: isEmpty(item) ? false : item.enabled,
      };
    });
  },
});

export const useFilter = () => {
  const [state, set] = useRecoilState(FilterSelector);

  return {
    filter: state,
    isデフォルトのフィルタ条件: () => FilterState.isデフォルトのフィルタ条件(state),
    set: {
      耐寒温度: (start: number | undefined, end: number | undefined) =>
        set(pre => ({ ...pre, 耐寒温度: { start, end }, enabled: true })),
      日光の強度: (v?: 日光の強度) => set(pre => ({ ...pre, 日光の強度: v, enabled: true })),
      keyword: (v?: string) => set(pre => ({ ...pre, keyword: v, enabled: true })),
      最後の灌水からの経過日数: (v: number | undefined) => {
        console.log({ update: v });
        if (!isDefined(v)) {
          set(pre => ({ ...pre, 最後の灌水からの経過日数: undefined }));
          return;
        }
        set(pre => ({ ...pre, 最後の灌水からの経過日数: { start: v }, enabled: true }));
      },
      toggleEnabled: () => set(pre => ({ ...pre, enabled: !pre.enabled })),
      clear: () => set(FilterState.DEFAULT()),
    },
  };
};
