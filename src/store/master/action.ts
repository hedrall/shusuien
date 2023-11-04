import { selector, useRecoilState } from 'recoil';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { User } from 'src/domain/entity/user';
import { useEffect, useState } from 'react';
import { 植物ごとのデフォルト設定 } from 'src/domain/entity/植物のデフォルト設定';
import { MASTER_STATE_ATOM } from '@frontend/store/master/atom';

const 植物ごとのデフォルト設定Selector = selector<植物ごとのデフォルト設定[]>({
  key: '植物ごとのデフォルト設定Selector',
  get: ({ get }) => get(MASTER_STATE_ATOM).植物のデフォルト設定,
  set: ({ set }, items) => {
    set(MASTER_STATE_ATOM, pre => {
      return {
        ...pre,
        植物のデフォルト設定: items as 植物ごとのデフォルト設定[],
      };
    });
  },
});

export namespace use植物ごとのデフォルト設定 {
  export const 購読を開始 = (userId: User.Id | undefined) => {
    const [, set] = useRecoilState(植物ごとのデフォルト設定Selector);

    const 購読 = (userId: User.Id) => {
      return FSAppRepository.植物ごとのデフォルト設定.購読(userId, items => {
        console.log('植物ごとのデフォルト設定をlisten', items);
        set(items.map(i => i.value));
      });
    };

    useEffect(() => {
      if (!userId) return;
      const { unsubscribe } = 購読(userId);
      return () => unsubscribe();
    }, [userId]);
  };

  export const 一覧を利用 = () => {
    const [state] = useRecoilState(植物ごとのデフォルト設定Selector);

    return {
      植物ごとのデフォルト設定一覧: state,
    };
  };

  export const 単一購読 = (id: 植物ごとのデフォルト設定.Id | undefined) => {
    const [設定, set設定] = useState<植物ごとのデフォルト設定 | null>(null);
    const 購読 = (id: 植物ごとのデフォルト設定.Id) => {
      return FSAppRepository.植物ごとのデフォルト設定.単体購読(id, item => {
        console.log('植物ごとのデフォルト設定をlisten', item);
        set設定(item.value);
      });
    };

    useEffect(() => {
      if (!id) return;
      const { unsubscribe } = 購読(id);
      return () => unsubscribe();
    }, [id]);

    return { 設定 };
  };
}
