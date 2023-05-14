import { FsAppManager } from '@frontend/domain/repository/firestore/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore/index';
import { UserId } from '@frontend/domain/model/user';
import * as fs from 'firebase/firestore';
import { RefValue } from '@frontend/domain/repository/firestore/type';
import { 履歴, 履歴ID, 履歴の内容 } from '@frontend/domain/model/履歴';
import { 鉢Id } from 'src/domain/model/鉢';

type 購読Options = {
  filter: 履歴の内容.Type[];
};

export namespace _FsApp履歴Repository {
  export const 作成 = async (新規履歴: 履歴) => {
    const manager = new FsAppManager.履歴();
    const ref = await FSAppRepository.addItem(manager, 新規履歴);
    return { id: ref.id as 履歴ID, ref };
  };

  export const 購読 = (id: 鉢Id, userId: UserId, options: 購読Options, onListen: (items: RefValue<履歴>[]) => void) => {
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
