import { useRecoilState, selector, selectorFamily } from 'recoil';
import { 棚, 棚ID } from '@frontend/domain/model/tana';
import { DATA_STATE_ATOM, DataState } from '@frontend/store/data/atom';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { User, UserId } from '@frontend/domain/model/user';
import { 鉢, 鉢Id } from '@frontend/domain/model/item';
import { useEffect, useState } from 'react';

const 鉢Selector = selectorFamily<鉢[], 棚ID>({
  key: '鉢Selector',
  get:
    棚ID =>
    ({ get }) => {
      console.log('get');
      return get(DATA_STATE_ATOM).鉢一覧[棚ID] || [];
    },
  set:
    棚Id =>
    ({ set }, items) => {
      set(DATA_STATE_ATOM, pre => {
        console.log('update state');
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
  const [state, set] = useRecoilState(鉢Selector(棚Id));

  const 鉢を購読 = (userId: UserId, 棚Id: 棚ID) => {
    return FSAppRepository.鉢.一覧購読({ userId, 棚Id }, items => {
      console.log('鉢をlisten', items);
      set(items.map(i => i.value));
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
      setItem(newItem.value);
    });
    return () => unsubscribe();
  }, [userId, id]);

  return { item, setItem };
};

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
