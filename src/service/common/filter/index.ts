import { 鉢 } from 'src/domain/entity/鉢';
import { FilterState } from 'src/store/filter/atom';
import { isDefined } from 'src/supports/functions';
import { ひらがなtoカタカナ } from 'src/supports/string';
import { 現在の季節 } from 'src/domain/const/季節';
import { useFilter as _useFilter } from 'src/store/filter/action';
import { _IFilterService as I } from 'src/service/common/filter/interface';

export const _FilterService: I = {
  Use: () => {
    const { filter, set, isデフォルトのフィルタ条件 } = _useFilter();

    return {
      フィルタを鉢に適用: (i: 鉢) => apply(i, filter),
      set,
      isデフォルト状態: () => isデフォルトのフィルタ条件(),
    };
  },
};

export const apply = (i: 鉢, filter: FilterState): boolean => {
  if (!filter.enabled) return true;
  const { 耐寒温度, keyword, 日光の強度, 最後の灌水からの経過日数 } = filter;
  if (isDefined(耐寒温度) && (isDefined(耐寒温度.start) || isDefined(耐寒温度?.end))) {
    const start = 耐寒温度?.start;
    const end = 耐寒温度?.end;
    const is =
      !!i.詳細.耐寒温度 &&
      (!isDefined(start) || i.詳細.耐寒温度 >= start) &&
      (!isDefined(end) || i.詳細.耐寒温度 <= end);
    if (!is) return false;
  }
  if (isDefined(keyword)) {
    const k = ひらがなtoカタカナ(keyword);
    const is = [i.詳細.科, i.詳細.属, i.詳細.種名, i.name].filter(Boolean).join('').includes(k);
    if (!is) return false;
  }
  if (isDefined(日光の強度)) {
    const 今季の強度 = i.詳細.日光の強度設定?.[現在の季節];
    const is = isDefined(今季の強度) && 今季の強度 === 日光の強度;
    console.log({
      今季の強度,
      日光の強度,
      is,
      i,
    });
    if (!is) return false;
  }
  const 最後の灌水からの経過日数Start = 最後の灌水からの経過日数?.start;
  if (isDefined(最後の灌水からの経過日数Start)) {
    const 経過日数 = i.最後の灌水からの経過日数();
    const is = !isDefined(経過日数) || 経過日数 >= 最後の灌水からの経過日数Start;
    if (!is) return false;
  }
  return true;
};
