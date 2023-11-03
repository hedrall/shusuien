import { FsAppManager } from '@frontend/domain/repository/firestore/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore/index';
import { UserId } from 'src/domain/entity/user';
import * as fs from 'firebase/firestore';
import { RefValue } from '@frontend/domain/repository/firestore/type';
import { 鉢, 鉢のBase } from 'src/domain/entity/鉢';
import { 棚ID } from 'src/domain/entity/棚';
import { Dayjs } from 'dayjs';
import { basicToFirestore } from '@frontend/domain/repository/firestore/converters/app';

export namespace _FsApp鉢Repository {
  export const getId = (): 鉢.Id => {
    const manager = new FsAppManager.鉢();
    return FSAppRepository.getId(manager);
  };

  export const 作成 = async (新規鉢: 鉢, id: 鉢.Id) => {
    const manager = new FsAppManager.鉢();
    await FSAppRepository.addItemWithId(manager, 新規鉢, id);
  };

  export const 更新 = async (id: 鉢.Id, props: fs.UpdateData<鉢のBase>) => {
    const manager = new FsAppManager.鉢();
    await FSAppRepository.update(manager, id, props);
  };

  export const snapshotを更新 = async (id: 鉢.Id, 更新後のsnapshot: Partial<鉢['snapshot']>, date: Dayjs) => {
    const manager = new FsAppManager.鉢();
    const rawUpdateParams = Object.entries(更新後のsnapshot).reduce(
      (p, [key, value]) => {
        return {
          ...p,
          [`snapshot.${key}`]: value,
        };
      },
      {
        'snapshot.更新日時': date.format(),
      },
    );
    const updateParams = basicToFirestore(rawUpdateParams);
    await FSAppRepository.update(manager, id, updateParams);
  };

  export const 画像を更新 = async (id: 鉢.Id, 画像のURL: string, date: Dayjs) => {
    await snapshotを更新(id, { 画像のURL }, date);
  };

  type 購読Params = { userId: UserId; 棚Id: 棚ID };
  export const 一覧購読 = (params: 購読Params, onListen: (items: RefValue<鉢>[]) => void) => {
    const { userId, 棚Id } = params;
    const manager = new FsAppManager.鉢();
    const { unsubscribe } = FSAppRepository.listenList(
      manager,
      {
        wheres: [fs.where('userId', '==', userId), fs.where('棚Id', '==', 棚Id), fs.where('削除済み', '==', false)],
        orderBy: [{ key: '作成日時', dir: 'asc' }],
      },
      items => onListen(items),
    );
    return { unsubscribe };
  };
  export const 全て購読 = (userId: UserId, onListen: (items: RefValue<鉢>[]) => void) => {
    const manager = new FsAppManager.鉢();
    const { unsubscribe } = FSAppRepository.listenList(
      manager,
      {
        wheres: [fs.where('userId', '==', userId), fs.where('削除済み', '==', false)],
        orderBy: [{ key: '作成日時', dir: 'asc' }],
      },
      items => onListen(items),
    );
    return { unsubscribe };
  };
  export const 単体購読 = (id: 鉢.Id, onListen: (items: RefValue<鉢>) => void) => {
    const manager = new FsAppManager.鉢();
    return FSAppRepository.listenById(manager, id, items => onListen(items));
  };
}
