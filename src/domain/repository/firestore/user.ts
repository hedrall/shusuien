import { FsAppManager } from '@frontend/domain/repository/firestore/manager/app';
import { FSAppRepository } from '@frontend/domain/repository/firestore/index';
import { User } from 'src/domain/entity/user';
import * as fs from 'firebase/firestore';

export namespace _FsAppUserRepository {
  export const 作成 = async (新規User: User, uid: string) => {
    const manager = new FsAppManager.User();
    await FSAppRepository.addItemWithId(manager, User.createDefault(uid), uid as User.Id);
  };

  export const 更新 = async (id: User.Id, data: fs.UpdateData<User>) => {
    const manager = new FsAppManager.User();
    await FSAppRepository.update(manager, id, data);
  };
}
