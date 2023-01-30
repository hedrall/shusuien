import { 棚 } from '@frontend/domain/model/tana';
import { FsAppManager } from '@frontend/domain/repository/firebase/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore/index';
import { UserId } from '@frontend/domain/model/user';
import * as fs from 'firebase/firestore';

import { RefValue } from '@frontend/domain/repository/firestore/type';

export namespace _FsApp棚Repository {
  export const 作成 = async (name: string, userId: UserId) => {
    const manager = new FsAppManager.棚();
    await FSAppRepository.addItem(
      manager,
      new 棚({
        name,
        userId,
      }),
    );
  };

  export const 購読 = (userId: UserId, onListen: (items: RefValue<棚>[]) => void) => {
    const manager = new FsAppManager.棚();
    const { unsubscribe } = FSAppRepository.listenList(
      manager,
      {
        wheres: [fs.where('userId', '==', userId)],
      },
      items => onListen(items),
    );
    return { unsubscribe };
  };
}
