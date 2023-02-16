import { 棚, 棚ID } from '@frontend/domain/model/tana';
import { FsAppManager } from '@frontend/domain/repository/firebase/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore/index';
import { UserId } from '@frontend/domain/model/user';
import * as fs from 'firebase/firestore';
import { RefValue } from '@frontend/domain/repository/firestore/type';

export namespace _FsApp棚Repository {
  export const 作成 = async (新規棚: 棚) => {
    const manager = new FsAppManager.棚();
    await FSAppRepository.addItem(manager, 新規棚);
  };
  export const 更新 = async (id: 棚ID, data: fs.UpdateData<棚>) => {
    const manager = new FsAppManager.棚();
    await FSAppRepository.update(manager, id, data);
  };

  export const 購読 = (userId: UserId, onListen: (items: RefValue<棚>[]) => void) => {
    const manager = new FsAppManager.棚();
    const { unsubscribe } = FSAppRepository.listenList(
      manager,
      {
        wheres: [fs.where('userId', '==', userId), fs.where('削除済み', '==', false)],
        orderBy: { key: '作成日時', dir: 'asc' },
      },
      items => onListen(items),
    );
    return { unsubscribe };
  };
}
