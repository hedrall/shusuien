import { UserId } from '@frontend/domain/model/user';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { useEffect, useState } from 'react';
import { 履歴 } from '@frontend/domain/model/history';
import { 鉢Id } from '@frontend/domain/model/item';

export const use鉢の履歴一覧 = (id: 鉢Id | undefined, userId: UserId | undefined) => {
  const [state, setState] = useState<履歴[]>([]);

  useEffect(() => {
    if (!userId && !id) return;
    const { unsubscribe } = FSAppRepository.履歴.購読(id, userId, list => {
      setState(list.map(i => i.value));
    });
    return () => unsubscribe();
  }, [userId, id]);

  return state;
};
