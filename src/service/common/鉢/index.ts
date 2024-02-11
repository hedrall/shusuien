import { _I鉢Service as I } from 'src/service/common/鉢/interface';
import { use全ての鉢一覧V2 } from 'src/store/data/action';
import { User } from 'src/domain/entity/user';

export const _鉢Service: I = {
  useAll: (user: User | undefined, uniqueKey: string) => {
    const { 鉢一覧 } = use全ての鉢一覧V2(user, uniqueKey);
    return 鉢一覧;
  },
};
