import { FsAppManager } from '@frontend/domain/repository/firebase/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore/index';
import { UserId } from '@frontend/domain/model/user';
import * as fs from 'firebase/firestore';
import { RefValue } from '@frontend/domain/repository/firestore/type';
import { 鉢, 鉢Id } from '@frontend/domain/model/item';
import { 棚ID } from '@frontend/domain/model/tana';
import { Dayjs } from 'dayjs';
import { basicToFirestore } from '@frontend/domain/repository/firebase/converters/app';

export namespace _FsApp鉢Repository {
  export const getId = (): 鉢Id => {
    const manager = new FsAppManager.鉢();
    return FSAppRepository.getId(manager);
  };

  export const 作成 = async (新規鉢: 鉢, id: 鉢Id) => {
    const manager = new FsAppManager.鉢();
    await FSAppRepository.addItemWithId(manager, 新規鉢, id);
  };

  export const snapshotを更新 = async (id: 鉢Id, 更新後のsnapshot: Partial<鉢['snapshot']>, date: Dayjs) => {
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

  export const 画像を更新 = async (id: 鉢Id, 画像のPATH: string, date: Dayjs) => {
    await snapshotを更新(id, { 画像のPATH }, date);
  };

  type 購読Params = { userId: UserId; 棚Id: 棚ID };
  export const 一覧購読 = (params: 購読Params, onListen: (items: RefValue<鉢>[]) => void) => {
    const { userId, 棚Id } = params;
    const manager = new FsAppManager.鉢();
    const { unsubscribe } = FSAppRepository.listenList(
      manager,
      {
        wheres: [fs.where('userId', '==', userId), fs.where('棚Id', '==', 棚Id)],
        orderBy: { key: '作成日時', dir: 'asc' },
      },
      items => onListen(items),
    );
    return { unsubscribe };
  };
  export const 単体購読 = (id: 鉢Id, onListen: (items: RefValue<鉢>) => void) => {
    const manager = new FsAppManager.鉢();
    return FSAppRepository.listenById(manager, id, items => onListen(items));
  };
}
