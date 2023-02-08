import { FsAppManager } from '@frontend/domain/repository/firebase/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore/index';
import { UserId } from '@frontend/domain/model/user';
import * as fs from 'firebase/firestore';
import { RefValue } from '@frontend/domain/repository/firestore/type';
import { 鉢, 鉢Id } from '@frontend/domain/model/item';

export namespace _FsApp鉢Repository {
  export const 作成 = async (新規鉢: 鉢) => {
    const manager = new FsAppManager.鉢();
    const ref = await FSAppRepository.addItem(manager, 新規鉢);
    return { 鉢ID: ref.id as 鉢Id };
  };

  export const 購読 = (userId: UserId, onListen: (items: RefValue<鉢>[]) => void) => {
    const manager = new FsAppManager.鉢();
    const { unsubscribe } = FSAppRepository.listenList(
      manager,
      {
        wheres: [fs.where('userId', '==', userId)],
        orderBy: { key: '作成日時', dir: 'asc' },
      },
      items => onListen(items),
    );
    return { unsubscribe };
  };
}
