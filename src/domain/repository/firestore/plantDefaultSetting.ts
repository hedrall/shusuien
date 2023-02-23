import { FsAppManager } from '@frontend/domain/repository/firestore/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore/index';
import { 植物ごとのデフォルト設定 } from '@frontend/domain/model/plantDefautlSetting';

type 設定 = 植物ごとのデフォルト設定;
export namespace _FsApp植物ごとのデフォルト設定Repository {
  export const 作成 = async (新規設定: 設定) => {
    const manager = new FsAppManager.植物ごとのデフォルト設定();
    await FSAppRepository.addItem(manager, 新規設定);
  };
  // export const 更新 = async (id: 棚ID, data: fs.UpdateData<棚>) => {
  //   const manager = new FsAppManager.棚();
  //   await FSAppRepository.update(manager, id, data);
  // };
  //
  // export const 購読 = (userId: UserId, onListen: (items: RefValue<棚>[]) => void) => {
  //   const manager = new FsAppManager.棚();
  //   const { unsubscribe } = FSAppRepository.listenList(
  //     manager,
  //     {
  //       wheres: [fs.where('userId', '==', userId), fs.where('削除済み', '==', false)],
  //       orderBy: { key: '作成日時', dir: 'asc' },
  //     },
  //     items => onListen(items),
  //   );
  //   return { unsubscribe };
  // };
}
