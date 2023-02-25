import { useRecoilState, selector, selectorFamily } from 'recoil';
import { 棚, 棚ID } from '@frontend/domain/model/tana';
import { DATA_STATE_ATOM, DataState } from '@frontend/store/data/atom';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { User, UserId } from '@frontend/domain/model/user';
import { 日光の強度設定, 鉢, 鉢Id } from '@frontend/domain/model/item';
import { useEffect, useState } from 'react';
import { MASTER_STATE_ATOM } from '@frontend/store/master/atom';
import { isDefined, optionalValue } from '@frontend/supports/functions';
import { 植物ごとのデフォルト設定サービス } from '@frontend/domain/service/plantDefaultSetting';
import { 季節, 現在の季節 } from '@frontend/domain/const/season';
import { FILTER_STATE_ATOM, FilterState } from '@frontend/store/filter/atom';
import { 植物ごとのデフォルト設定 } from '@frontend/domain/model/plantDefautlSetting';
import { NOW, 今日 } from '@frontend/supports/date';
import { 鉢Service } from '@frontend/domain/service/item';

const フィルタを適用 = (i: 鉢, filter: FilterState) => {
  const { 耐寒温度, keyword, 日光の強度, 最後の灌水からの経過日数 } = filter;
  let is = true;
  if ((isDefined(耐寒温度) && isDefined(耐寒温度.start)) || isDefined(耐寒温度?.end)) {
    is =
      !!i.詳細.耐寒温度 &&
      (!isDefined(耐寒温度?.start) || i.詳細.耐寒温度 >= 耐寒温度?.start) &&
      (!isDefined(耐寒温度?.end) || i.詳細.耐寒温度 <= 耐寒温度?.end);
  }
  if (isDefined(keyword)) {
    is = [i.詳細.科, i.詳細.属, i.詳細.種名, i.name].filter(Boolean).join('').includes(keyword);
  }
  if (isDefined(日光の強度)) {
    const 今季の強度 = i.詳細.日光の強度設定?.[現在の季節];
    is = isDefined(今季の強度) && 今季の強度 === 日光の強度;
  }
  const 最後の灌水からの経過日数Start = 最後の灌水からの経過日数?.start;
  if (isDefined(最後の灌水からの経過日数Start)) {
    console.log({ i });
    const 経過日数 = i.最後の灌水からの経過日数;
    console.log({ 経過日数, 最後の灌水からの経過日数Start });
    is = isDefined(経過日数) && 経過日数 >= 最後の灌水からの経過日数Start;
  }
  return is;
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
        .map(i => 植物ごとのデフォルト設定サービス.デフォルト直を適用(i, デフォルト設定一覧).デフォルトを適用した鉢)
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
