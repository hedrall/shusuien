import { useRecoilState } from 'recoil';
import { 棚 } from '@frontend/domain/model/tana';
import { DATA_STATE } from '@frontend/store/data/atom';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { UserId } from '@frontend/domain/model/user';
import { RefValue } from '@frontend/domain/repository/firestore/type';

export const useDataState = () => {
  const [state, setState] = useRecoilState(DATA_STATE);

  const set = {
    棚: (i: RefValue<棚>[]) => setState(pre => ({ ...pre, 棚 })),
  };

  const 棚を購読 = (userId: UserId) => {
    return FSAppRepository.棚.購読(userId, items => {
      set.棚(items);
    });
  };

  return {
    棚一覧: state.棚一覧,
    棚をSet: set.棚,
    棚を購読,
  };
};
