import { Opaque } from 'type-fest';
import { UserId } from 'src/domain/entity/user';
import dayjs, { Dayjs } from 'dayjs';
import { 履歴 } from 'src/domain/entity/鉢/entity/履歴';
import { 棚ID } from 'src/domain/entity/棚';
import { optionalCall } from '@frontend/supports/functions';
import { _植替えする } from 'src/domain/entity/鉢/管理操作/植替';
import { _新規作成する } from 'src/domain/entity/鉢/管理操作/新規作成';
import { _灌水する } from 'src/domain/entity/鉢/管理操作/灌水';
import { _成長を記録する } from 'src/domain/entity/鉢/管理操作/成長を記録';
import { Subject } from 'rxjs';
import { 今日 } from '@frontend/supports/date';
import { 日光の強度設定 } from 'src/domain/entity/鉢/日光の強度設定';
import { 育成タイプ } from 'src/domain/entity/鉢/育成タイプ';
import { _Snapshot } from 'src/domain/entity/鉢/Snapshot';
import { _フィールドを更新, _日光の強度を更新, _詳細を更新 } from 'src/domain/entity/鉢/管理操作/更新';
import { _削除 } from 'src/domain/entity/鉢/管理操作/削除';

type 鉢Id = Opaque<string, '鉢ID'>;

export namespace 鉢 {
  export type Id = 鉢Id;
  export type Props = {
    id: 鉢Id | undefined;
    userId: UserId;
    name: string | undefined;
    棚Id: 棚ID;
    詳細: {
      科?: string;
      属?: string;
      種名?: string;
      育成タイプ?: 育成タイプ;
      耐寒温度?: number;
      日光の強度設定?: 日光の強度設定;
      水切れ日数?: number;
      入手元?: string;
      金額?: number;
    };
    補足?: string;
    // 現在の状態 (履歴を畳み込んで得られる)
    snapshot: _Snapshot;
    作成日時: Dayjs;
    削除済み: boolean;
  };

  export const construct = (props: Props) => {
    return {
      ...props,
      snapshot: {
        ...props.snapshot,
        最後の植替え: optionalCall(props.snapshot.最後の植替え, dayjs),
        最後の灌水: optionalCall(props.snapshot.最後の灌水, v => ({
          日時: dayjs(v.日時),
          量: v.量,
        })),
        最後の液肥: {
          日時: optionalCall(props.snapshot.最後の液肥?.日時, dayjs),
        },
        画像のURL: props.snapshot.画像のURL,
        small画像のURL: props.snapshot.small画像のURL,
        更新日時: dayjs(props.snapshot.更新日時),
      },
      詳細: {
        ...props.詳細,
        科: props.詳細.科,
        属: props.詳細.属,
        種名: props.詳細.種名,
        育成タイプ: props.詳細.育成タイプ,
        耐寒温度: props.詳細.耐寒温度,
        日光の強度設定: props.詳細.日光の強度設定,
        水切れ日数: props.詳細.水切れ日数,
        入手元: props.詳細.入手元,
        金額: props.詳細.金額,
      },
      作成日時: dayjs(props.作成日時),
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
    } as const;
  };

  export const events = {
    フィールドを更新: new Subject<{ フィールド名: string; 更新後のValue: any }>(),
    詳細を更新: new Subject<{ プロパティ名: string; 更新後のValue: any }>(),
    削除: new Subject<{ item: 鉢 }>(),
    管理: new Subject<{ type: 履歴.Type | '新規作成' }>(),
  };

  export const 新規作成 = _新規作成する;

  export type 更新可能なフィールドのKey = Extract<keyof 鉢, 'name' | '補足' | '棚Id'>;
  export type デフォルト設定可能な鉢のプロパティ = Pick<鉢['詳細'], '耐寒温度' | '日光の強度設定'>;
}
export type 鉢 = ReturnType<typeof 鉢.construct>;
