import { User } from 'src/domain/entity/user';
import { 棚 } from 'src/domain/entity/棚';
import { 鉢 } from 'src/domain/entity/鉢';
import dayjs, { Dayjs } from 'dayjs';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴/index';
import { _灌水履歴 } from 'src/domain/entity/鉢/entity/履歴/灌水';
import { _成長の記録 } from 'src/domain/entity/鉢/entity/履歴/成長の記録';
import { _植替え履歴 } from 'src/domain/entity/鉢/entity/履歴/植替え';

export namespace 履歴Base {
  export type Props = {
    id: string | undefined;
    userId: User.Id;
    対象の棚のID: 棚.Id | undefined;
    対象の鉢のID: 鉢.Id | undefined;
    作成日時: Dayjs;
    削除済み: boolean;
    内容: object & { type: string };
  };
  export const construct = (props: Props) => {
    return {
      ...props,
      作成日時: dayjs(props.作成日時),
    } as const satisfies Props;
  };
  export const Guard = {
    is灌水: (i: 履歴): i is _灌水履歴 => i.内容.type === '灌水',
    is成長の記録: (i: 履歴): i is _成長の記録 => i.内容.type === '成長の記録',
    is植替え: (i: 履歴): i is _植替え履歴 => i.内容.type === '植替え',
  };
}
export type 履歴Base = ReturnType<typeof 履歴Base.construct>;

export type NewProps<履歴Base extends object & { 内容: object }> = {
  props: Omit<履歴Base, 'id' | '内容' | '削除済み'>;
  内容: Omit<履歴Base['内容'], 'type'>;
};
