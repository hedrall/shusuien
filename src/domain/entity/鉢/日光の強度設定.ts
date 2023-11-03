import { 季節 } from 'src/domain/const/季節';

import { 日光の強度 } from 'src/domain/entity/鉢/日光の強度';

export namespace 日光の強度設定 {
  export const Default: Record<季節, 日光の強度 | undefined> = {
    春: undefined,
    夏: undefined,
    秋: undefined,
    冬: undefined,
  };
}
export type 日光の強度設定 = {
  春?: 日光の強度;
  夏?: 日光の強度;
  秋?: 日光の強度;
  冬?: 日光の強度;
};
