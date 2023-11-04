import { FsAppManager } from '@frontend/domain/repository/firestore/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { User } from 'src/domain/entity/user';
import { RefValue } from '@frontend/domain/repository/firestore/type';
import { 棚の並び順 } from 'src/domain/entity/棚の並び順';

export namespace _FsApp棚の並び順Repository {
  export const 更新 = async (i: 棚の並び順) => {
    const manager = new FsAppManager.棚の並び順();
    await FSAppRepository.set(manager, i.userId, i);
  };

  export const 購読 = (userId: User.Id, onListen: (items: RefValue<棚の並び順>) => void) => {
    const manager = new FsAppManager.棚の並び順();
    const { unsubscribe } = FSAppRepository.listenById(manager, userId, onListen);
    return { unsubscribe };
  };
}
