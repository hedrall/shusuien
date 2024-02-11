import { _useお手入れページの鉢一覧 } from 'src/service/お手入れ';
import { 鉢 } from 'src/domain/entity/鉢';

export const Service: IService = {
  お手入れページ: {
    use鉢一覧: _useお手入れページの鉢一覧,
  },
};
export type IService = {
  お手入れページ: {
    use鉢一覧: () => 鉢[];
  };
};
