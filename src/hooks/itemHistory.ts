import { UserId } from '@frontend/domain/model/user';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { useEffect, useState } from 'react';
import { 履歴, 履歴の内容 } from '@frontend/domain/model/履歴';
import { 鉢Id } from '@frontend/domain/model/鉢';

type Options = {
  filter: 履歴の内容.Type[];
};
export const use鉢の履歴一覧 = (id: 鉢Id | undefined, userId: UserId | undefined, options: Options) => {
  const [state, setState] = useState<履歴[]>([]);

  useEffect(() => {
    if (!userId || !id) return;
    const { unsubscribe } = FSAppRepository.履歴.購読(id, userId, options, list => {
      console.log('[購読]: 履歴一覧', list.length);
      setState(list.map(i => i.value));
    });
    return () => unsubscribe();
  }, [userId, id, options.filter.join()]);

  return state;
};
