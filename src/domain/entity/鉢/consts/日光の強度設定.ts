import { 季節 } from 'src/domain/const/季節';
import { _日光の強度 } from 'src/domain/entity/鉢/consts/日光の強度';

export namespace _日光の強度設定 {
  export const Default: Record<季節, _日光の強度 | undefined> = {
    春: undefined,
    夏: undefined,
    秋: undefined,
    冬: undefined,
  };
}
export type _日光の強度設定 = {
  春?: _日光の強度;
  夏?: _日光の強度;
  秋?: _日光の強度;
  冬?: _日光の強度;
};
