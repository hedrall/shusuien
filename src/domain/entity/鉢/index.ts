import { Opaque } from 'type-fest';
import { User } from 'src/domain/entity/user';
import dayjs, { Dayjs } from 'dayjs';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import { 棚 } from 'src/domain/entity/棚';
import { optionalCall } from '@frontend/supports/functions';
import { _植替えする } from 'src/domain/entity/鉢/管理操作/植替';
import { _新規作成する } from 'src/domain/entity/鉢/管理操作/新規作成';
import { _灌水する } from 'src/domain/entity/鉢/管理操作/灌水';
import { _成長を記録する } from 'src/domain/entity/鉢/管理操作/成長を記録';
import { Subject } from 'rxjs';
import { 今日 } from '@frontend/supports/date';
import { _Snapshot } from 'src/domain/entity/鉢/valueObject/Snapshot';
import { _フィールドを更新, _日光の強度を更新, _詳細を更新 } from 'src/domain/entity/鉢/管理操作/更新';
import { _削除 } from 'src/domain/entity/鉢/管理操作/削除';
import { _詳細 } from 'src/domain/entity/鉢/valueObject/詳細';
import { _日光の強度 } from 'src/domain/entity/鉢/consts/日光の強度';
import { _日光の強度設定 } from 'src/domain/entity/鉢/consts/日光の強度設定';
import { _育成タイプ } from 'src/domain/entity/鉢/consts/育成タイプ';
import { _植替待にする } from 'src/domain/entity/鉢/管理操作/植替待設定';

type 鉢Id = Opaque<string, '鉢ID'>;

export type 鉢 = ReturnType<typeof 鉢.construct>;
export namespace 鉢 {
  export type Id = 鉢Id;

  export type Props = {
    id: 鉢Id | undefined;
    userId: User.Id;
    name: string | undefined;
    棚Id: 棚.Id;

    詳細: _詳細.Props;
    // 現在の状態 (履歴を畳み込んで得られる)
    snapshot: _Snapshot.Props;

    補足?: string;
    作成日時: Dayjs;
    削除済み: boolean;
  };

  export const construct = (props: Props) => {
    return {
      ...props,

      snapshot: _Snapshot.construct(props.snapshot),
      詳細: _詳細.construct(props.詳細),

      作成日時: dayjs(props.作成日時),

      // --- computed ---
      最後の灌水からの経過日数(): number | undefined {
        const 日時 = this.snapshot.最後の灌水?.日時;
        return optionalCall(日時, v => 今日.diff(v.startOf('day'), 'days'));
      },

      // --- methods ---
      削除: _削除,
      // TODO 更新系をまとめてnestしたいが、型エラーが発生する
      詳細を更新: _詳細を更新,
      日光の強度を更新: _日光の強度を更新,
      フィールドを更新: _フィールドを更新,
      植替え: _植替えする,
      灌水: _灌水する,
      成長を記録: _成長を記録する,
      植替待にする: _植替待にする,
    } as const;
  };

  export const events = {
    フィールドを更新: new Subject<{ フィールド名: string; 更新後のValue: any }>(),
    詳細を更新: new Subject<{ プロパティ名: string; 更新後のValue: any }>(),
    削除: new Subject<{ item: 鉢 }>(),
    管理: new Subject<{ type: 履歴.Type | '新規作成' }>(),
  };
  export const 新規作成 = _新規作成する;

  export const 日光の強度 = _日光の強度;
  export type 日光の強度 = _日光の強度;
  export const 日光の強度設定 = _日光の強度設定;
  export type 日光の強度設定 = _日光の強度設定;
  export const 育成タイプ = _育成タイプ;
  export type 育成タイプ = _育成タイプ;
  export type 更新可能なフィールドのKey = Extract<keyof 鉢, 'name' | '補足' | '棚Id'>;
  export type デフォルト設定可能な鉢のプロパティ = Pick<鉢['詳細'], '耐寒温度' | '日光の強度設定'>;
}
