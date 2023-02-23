import { FsAppManager } from '@frontend/domain/repository/firestore/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore/index';
import { 植物ごとのデフォルト設定, 植物ごとのデフォルト設定Id } from '@frontend/domain/model/plantDefautlSetting';
import { UserId } from '@frontend/domain/model/user';
import { RefValue } from '@frontend/domain/repository/firestore/type';
import * as fs from 'firebase/firestore';

type 設定 = 植物ごとのデフォルト設定;
export namespace _FsApp植物ごとのデフォルト設定Repository {
  export const 作成 = async (新規設定: 設定) => {
    const manager = new FsAppManager.植物ごとのデフォルト設定();
    await FSAppRepository.addItem(manager, 新規設定);
  };

  export const 更新 = async (id: 植物ごとのデフォルト設定Id, data: fs.UpdateData<設定>) => {
    const manager = new FsAppManager.植物ごとのデフォルト設定();
    await FSAppRepository.update(manager, id, data);
  };

  export const 購読 = (userId: UserId, onListen: (items: RefValue<植物ごとのデフォルト設定>[]) => void) => {
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
}
