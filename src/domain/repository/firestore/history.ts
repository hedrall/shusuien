import { FsAppManager } from '@frontend/domain/repository/firebase/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore/index';
import { UserId } from '@frontend/domain/model/user';
import * as fs from 'firebase/firestore';
import { RefValue } from '@frontend/domain/repository/firestore/type';
import { 履歴, 履歴ID } from '@frontend/domain/model/history';

export namespace _FsApp履歴Repository {
  export const 作成 = async (新規履歴: 履歴) => {
    const manager = new FsAppManager.履歴();
    const ref = await FSAppRepository.addItem(manager, 新規履歴);
    return { id: ref.id as 履歴ID };
  };

  export const 購読 = (userId: UserId, onListen: (items: RefValue<履歴>[]) => void) => {
    const manager = new FsAppManager.履歴();
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
