import { FsAppManager } from '@frontend/domain/repository/firebase/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore/index';
import { UserId } from '@frontend/domain/model/user';
import * as fs from 'firebase/firestore';
import { RefValue } from '@frontend/domain/repository/firestore/type';
import { 鉢, 鉢Id } from '@frontend/domain/model/item';
import { 棚ID } from '@frontend/domain/model/tana';

export namespace _FsApp鉢Repository {
  export const 作成 = async (新規鉢: 鉢) => {
    const manager = new FsAppManager.鉢();
    const ref = await FSAppRepository.addItem(manager, 新規鉢);
    return { 鉢ID: ref.id as 鉢Id };
  };

  export const 画像を更新 = async (鉢Id: 鉢Id, 画像のPATH: string) => {
    const manager = new FsAppManager.鉢();
    await FSAppRepository.update(manager, 鉢Id, {
      'snapshot.画像のPATH': 画像のPATH,
    });
  };

  type 購読Params = { userId: UserId; 棚Id: 棚ID };
  export const 購読 = (params: 購読Params, onListen: (items: RefValue<鉢>[]) => void) => {
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
}
