import { useRecoilState, selector, selectorFamily } from 'recoil';
import { 棚, 棚ID } from '@frontend/domain/model/棚';
import { DATA_STATE_ATOM, DataState } from '@frontend/store/data/atom';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { User, UserId } from '@frontend/domain/model/user';
import { 日光の強度設定, 鉢, 鉢Id } from '@frontend/domain/model/鉢';
import { useEffect, useState } from 'react';
import { MASTER_STATE_ATOM } from '@frontend/store/master/atom';
import { isDefined, optionalCall, optionalValue } from '@frontend/supports/functions';
import { 植物ごとのデフォルト設定サービス } from '@frontend/domain/service/plantDefaultSetting';
import { 季節, 現在の季節 } from '@frontend/domain/const/季節';
import { FILTER_STATE_ATOM, FilterState } from '@frontend/store/filter/atom';
import { 植物ごとのデフォルト設定 } from '@frontend/domain/model/植物のデフォルト設定';
import { NOW, x日前の表記, 今日 } from '@frontend/supports/date';
import { 鉢Service } from '@frontend/domain/service/item';
import { ひらがなtoカタカナ } from '@frontend/supports/string';
import dayjs from 'dayjs';
import { 水切れのデフォルト日数 } from '@frontend/supports/settings';

const フィルタを適用 = (i: 鉢, filter: FilterState): boolean => {
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
    const 経過日数 = i.最後の灌水からの経過日数;
    const is = !isDefined(経過日数) || 経過日数 >= 最後の灌水からの経過日数Start;
    if (!is) return false;
  }
  return true;
};

const 鉢一覧Selector = selectorFamily<鉢[], 棚ID>({
  key: '鉢一覧Selector',
  get:
    棚ID =>
    ({ get }) => {
      const 鉢一覧 = get(DATA_STATE_ATOM).鉢一覧[棚ID] || [];
      const デフォルト設定一覧 = get(MASTER_STATE_ATOM).植物のデフォルト設定;
      const filter = get(FILTER_STATE_ATOM);

      return 鉢一覧
        .map(i => 植物ごとのデフォルト設定サービス.デフォルト直を適用(i, デフォルト設定一覧))
        .filter(i => フィルタを適用(i, filter));
    },
  set:
    棚Id =>
    ({ set }, items) => {
      set(DATA_STATE_ATOM, pre => {
        return {
          ...pre,
          鉢一覧: {
            ...pre.鉢一覧,
            [棚Id]: items,
          },
        };
      });
    },
});

export const use鉢一覧 = (棚Id: 棚ID, user: User | undefined) => {
  // デフォルト直が適用されているので注意
  const [state, set] = useRecoilState(鉢一覧Selector(棚Id));

  const 鉢を購読 = (userId: UserId, 棚Id: 棚ID) => {
    return FSAppRepository.鉢.一覧購読({ userId, 棚Id }, items => {
      console.log('[購読]: 鉢一覧', items);
      set(鉢Service.並び替える(items.map(i => i.value)));
    });
  };

  useEffect(() => {
    if (!user?.id) return;
    const { unsubscribe } = 鉢を購読(user.id, 棚Id);
    return () => unsubscribe();
  }, [user?.id, 棚Id]);

  return {
    鉢一覧: state,
  };
};

const use全ての鉢一覧 = (user: User | undefined) => {
  // デフォルト直が適用されているので注意
  const [state, set] = useRecoilState(鉢一覧Selector('#@$$@#all' as 棚ID));

  const 鉢を購読 = (userId: UserId) => {
    return FSAppRepository.鉢.全て購読(userId, items => {
      console.log('[購読]: 全ての鉢を購読', items);
      set(鉢Service.並び替える(items.map(i => i.value)));
    });
  };

  useEffect(() => {
    if (!user?.id) return;
    const { unsubscribe } = 鉢を購読(user.id);
    return () => unsubscribe();
  }, [user?.id]);

  return { 鉢一覧: state };
};

export const 灌水が必要な鉢一覧 = (user: User | undefined) => {
  const { 鉢一覧 } = use全ての鉢一覧(user);
  type Res = {
    要灌水: 鉢[];
    それ以外: 鉢[];
  };

  return 鉢一覧.reduce<Res>(
    (pre, 鉢) => {
      const 最後の灌水からの経過日数 = 鉢.最後の灌水からの経過日数;
      const is要灌水 =
        !isDefined(最後の灌水からの経過日数) ||
        最後の灌水からの経過日数 >= (鉢.詳細.水切れ日数 || 水切れのデフォルト日数);
      if (is要灌水) return { ...pre, 要灌水: [...pre.要灌水, 鉢] };
      return { ...pre, それ以外: [...pre.それ以外, 鉢] };
    },
    { 要灌水: [], それ以外: [] },
  );
};

export const use鉢単体 = (id: 鉢Id | undefined, userId: UserId | undefined) => {
  const [item, setItem] = useState<鉢 | undefined>(undefined);

  useEffect(() => {
    if (!userId || !id) return;
    const { unsubscribe } = FSAppRepository.鉢.単体購読(id, newItem => {
      console.log('[購読]: 鉢単体', newItem.ref.id, newItem.value);
      setItem(newItem.value);
    });
    return () => unsubscribe();
  }, [userId, id]);

  return { item, setItem };
};

export const 棚Selector = selector<棚[]>({
  key: '棚Selector',
  get: ({ get }) => {
    return get(DATA_STATE_ATOM).棚一覧 || [];
  },
  set: ({ set }, items) => {
    set(DATA_STATE_ATOM, pre => {
      return { ...pre, 棚一覧: items as 棚[] };
    });
  },
});

export namespace use棚一覧 {
  export const 購読 = (userId: UserId | undefined) => {
    const [, set] = useRecoilState(棚Selector);

    const 棚を購読 = (userId: UserId) => {
      return FSAppRepository.棚.購読(userId, items => {
        console.log('棚をlisten', items);
        set(items.map(i => i.value));
      });
    };

    useEffect(() => {
      if (!userId) return;
      const { unsubscribe } = 棚を購読(userId);
      return () => unsubscribe();
    }, [userId]);
  };

  export const 一覧を利用 = () => {
    const [state] = useRecoilState(棚Selector);
    return { 棚一覧: state };
  };
}

export const useDataState = () => {
  const [state, setState] = useRecoilState(DATA_STATE_ATOM);

  const set = {
    棚: (棚一覧: 棚[]) => {
      setState(pre => {
        return { ...pre, 棚一覧 } satisfies DataState;
      });
    },
    鉢: (棚Id: 棚ID, items: 鉢[]) => {
      setState(pre => {
        return {
          ...pre,
          鉢一覧: {
            ...pre.鉢一覧,
            [棚Id]: items,
          },
        };
      });
    },
  };

  const 棚を購読 = (userId: UserId) => {
    return FSAppRepository.棚.購読(userId, items => {
      set.棚(items.map(i => i.value));
    });
  };

  return {
    棚一覧: state.棚一覧,
    棚をSet: set.棚,
    棚を購読,
  };
};
