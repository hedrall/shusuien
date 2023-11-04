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

type Thisを指定したFn<R extends object> = (this: R, ...args: any[]) => any;
function EntityにMethodを追加<R extends object, K extends string, M extends Thisを指定したFn<R>>(
  key: K,
  method: M,
  resource: R,
): asserts resource is R & { [Key in K]: M } {
  // Thisにリソースを固定する
  const boundedMethod = method.bind(resource);
  Object.defineProperty(resource, key, {
    value: boundedMethod,
    enumerable: false,
    configurable: false,
    writable: false,
  });
}
function EntityにObjectを追加<R extends object, K extends string, O extends object>(
  key: K,
  obj: O,
  resource: R,
): asserts resource is R & { [Key in K]: O } {
  Object.defineProperty(resource, key, {
    value: obj,
    enumerable: false,
    configurable: false,
    writable: false,
  });
}

type 鉢Id = Opaque<string, '鉢ID'>;
export namespace 鉢 {
  export type Id = 鉢Id;

  // 鉢Entityのプロパティ部分
  export type Resource = {
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

  const createResource = (props: Resource) => {
    return {
      ...props,
      snapshot: _Snapshot.construct(props.snapshot),
      詳細: _詳細.construct(props.詳細),
      作成日時: dayjs(props.作成日時),
    };
  };

  const addMethods = (resource: Resource) => {
    const 最後の灌水からの経過日数 = function (this: Resource): number | undefined {
      const 日時 = this.snapshot.最後の灌水?.日時;
      return optionalCall(日時, v => 今日.diff(v.startOf('day'), 'days'));
    };

    EntityにMethodを追加('最後の灌水からの経過日数', 最後の灌水からの経過日数, resource);
    EntityにMethodを追加('削除', _削除, resource);
    EntityにObjectを追加(
      '更新',
      {
        日光の強度: _日光の強度を更新.bind(resource),
        フィールド: _フィールドを更新.bind(resource),
        詳細: _詳細を更新.bind(resource),
      },
      resource,
    );
    EntityにMethodを追加('植替え', _植替えする, resource);
    EntityにMethodを追加('灌水', _灌水する, resource);
    EntityにMethodを追加('成長を記録', _成長を記録する, resource);
    return resource;
  };

  export const construct = (props: Resource) => {
    const resource = createResource(props);
    return addMethods(resource);
  };

  export const events = {
    フィールドを更新: new Subject<{ フィールド名: string; 更新後のValue: any }>(),
    詳細を更新: new Subject<{ プロパティ名: string; 更新後のValue: any }>(),
    削除: new Subject<{ item: 鉢.Resource }>(),
    管理: new Subject<{ type: 履歴.Type | '新規作成' }>(),
  };
  export const 新規作成 = _新規作成する;

  export const 日光の強度 = _日光の強度;
  export type 日光の強度 = _日光の強度;
  export const 日光の強度設定 = _日光の強度設定;
  export type 日光の強度設定 = _日光の強度設定;
  export const 育成タイプ = _育成タイプ;
  export type 育成タイプ = _育成タイプ;

  export type 更新可能なフィールドのKey = Extract<keyof 鉢.Resource, 'name' | '補足' | '棚Id'>;
  export type デフォルト設定可能な鉢のプロパティ = Pick<鉢['詳細'], '耐寒温度' | '日光の強度設定'>;
}
export type 鉢 = ReturnType<typeof 鉢.construct>;
