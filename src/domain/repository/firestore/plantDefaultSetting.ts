import { FsAppManager } from '@frontend/domain/repository/firestore/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore/index';
import { 植物ごとのデフォルト設定 } from 'src/domain/entity/植物のデフォルト設定';
import { User } from 'src/domain/entity/user';
import { RefValue } from '@frontend/domain/repository/firestore/type';
import * as fs from 'firebase/firestore';

type 設定 = 植物ごとのデフォルト設定;
export namespace _FsApp植物ごとのデフォルト設定Repository {
  export const 作成 = async (新規設定: 設定) => {
    const manager = new FsAppManager.植物ごとのデフォルト設定();
    await FSAppRepository.addItem(manager, 新規設定);
  };

  export const 更新 = async (id: 植物ごとのデフォルト設定.Id, data: fs.UpdateData<設定>) => {
    const manager = new FsAppManager.植物ごとのデフォルト設定();
    await FSAppRepository.update(manager, id, data);
  };

  export const 購読 = (userId: User.Id, onListen: (items: RefValue<植物ごとのデフォルト設定>[]) => void) => {
    const manager = new FsAppManager.植物ごとのデフォルト設定();
    const { unsubscribe } = FSAppRepository.listenList(
      manager,
      {
        wheres: [fs.where('userId', '==', userId)],
        orderBy: { key: 'order', dir: 'asc' },
      },
      items => onListen(items),
    );
    return { unsubscribe };
  };

  export const 単体購読 = (
    id: 植物ごとのデフォルト設定.Id,
    onListen: (items: RefValue<植物ごとのデフォルト設定>) => void,
  ) => {
    const manager = new FsAppManager.植物ごとのデフォルト設定();
    return FSAppRepository.listenById(manager, id, item => onListen(item));
  };
}
