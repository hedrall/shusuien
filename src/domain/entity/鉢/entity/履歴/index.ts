import { Opaque } from 'type-fest';
import { tObjectKeys } from 'src/supports/functions';
import { _灌水履歴 } from 'src/domain/entity/鉢/entity/履歴/灌水';
import { _成長の記録 } from 'src/domain/entity/鉢/entity/履歴/成長の記録';
import { _植替え履歴 } from 'src/domain/entity/鉢/entity/履歴/植替え';

export type 履歴ID = Opaque<string, '履歴ID'>;

export namespace 履歴 {
  export type Type = 履歴['内容']['type'];
  export const Type = tObjectKeys({
    灌水: undefined,
    成長の記録: undefined,
    植替え: undefined,
  } as const satisfies { [Key in 履歴.Type]: undefined });

  export import 成長の記録 = _成長の記録;
  export import 植替え = _植替え履歴;
  export import 灌水 = _灌水履歴;
}
export type 履歴 = 履歴.成長の記録 | 履歴.植替え | 履歴.灌水;
