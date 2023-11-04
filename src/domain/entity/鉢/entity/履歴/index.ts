import { tObjectKeys } from 'src/supports/functions';
import { _灌水履歴 } from 'src/domain/entity/鉢/entity/履歴/灌水';
import { _成長の記録 } from 'src/domain/entity/鉢/entity/履歴/成長の記録';
import { _植替え履歴 } from 'src/domain/entity/鉢/entity/履歴/植替え';
import { _植替待設定履歴 } from 'src/domain/entity/鉢/entity/履歴/植替待設定';

export namespace 履歴 {
  export type Id = _成長の記録.Id | _植替え履歴.Id | _灌水履歴.Id | _植替待設定履歴.Id;

  export type Type = 履歴['内容']['type'];
  export const Type = tObjectKeys({
    灌水: undefined,
    成長の記録: undefined,
    植替え: undefined,
    植替待設定: undefined,
  } as const satisfies { [Key in 履歴.Type]: undefined });

  export import 成長の記録 = _成長の記録;
  export import 植替え = _植替え履歴;
  export import 灌水 = _灌水履歴;
  export import 植替待設定 = _植替待設定履歴;
}
export type 履歴 = 履歴.成長の記録 | 履歴.植替え | 履歴.灌水 | 履歴.植替待設定;
