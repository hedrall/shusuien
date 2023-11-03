import { FsAppManager } from '@frontend/domain/repository/firestore/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore/index';
import { UserId } from 'src/domain/entity/user';
import * as fs from 'firebase/firestore';
import { RefValue } from '@frontend/domain/repository/firestore/type';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import { 鉢 } from 'src/domain/entity/鉢';

type 購読Options = {
  filter: 履歴.Type[];
};

export namespace _FsApp履歴Repository {
  export const 作成 = async <T extends 履歴>(新規履歴: T) => {
    const manager = new FsAppManager.履歴();
    const ref = await FSAppRepository.addItem(manager, 新規履歴);
    return { id: ref.id as T['id'], ref };
  };

  export const 購読 = (
    id: 鉢.Id,
    userId: UserId,
    options: 購読Options,
    onListen: (items: RefValue<履歴>[]) => void,
  ) => {
    const manager = new FsAppManager.履歴();
    const { filter } = options;
    const { unsubscribe } = FSAppRepository.listenList(
      manager,
      {
        wheres: [
          fs.where('userId', '==', userId),
          fs.where('対象の鉢のID', '==', id),
          ...(filter.length ? [fs.where('内容.type', 'in', filter)] : []),
        ],
        orderBy: { key: '作成日時', dir: 'desc' },
      },
      items => onListen(items),
    );
    return { unsubscribe };
  };
}
