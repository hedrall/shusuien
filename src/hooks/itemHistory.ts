import { User } from 'src/domain/entity/user';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { useEffect, useState } from 'react';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import { 鉢 } from 'src/domain/entity/鉢';

type Options = {
  filter: 履歴.Type[];
};
export const use鉢の履歴一覧 = (id: 鉢.Id | undefined, userId: User.Id | undefined, options: Options) => {
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
