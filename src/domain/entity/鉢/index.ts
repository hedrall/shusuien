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
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { Subject } from 'rxjs';
import { 今日 } from '@frontend/supports/date';
import { 日光の強度設定 } from 'src/domain/entity/鉢/日光の強度設定';
import { 育成タイプ } from 'src/domain/entity/鉢/育成タイプ';
import { _Snapshot } from 'src/domain/entity/鉢/Snapshot';

type 鉢Id = Opaque<string, '鉢ID'>;
export class 鉢のBase {
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

  constructor(props: 鉢のBase) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.棚Id = props.棚Id;
    this.snapshot = {
      鉢のサイズ: props.snapshot.鉢のサイズ,
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
    };
    this.詳細 = {
      科: props.詳細.科,
      属: props.詳細.属,
      種名: props.詳細.種名,
      育成タイプ: props.詳細.育成タイプ,
      耐寒温度: props.詳細.耐寒温度,
      日光の強度設定: props.詳細.日光の強度設定,
      水切れ日数: props.詳細.水切れ日数,
      入手元: props.詳細.入手元,
      金額: props.詳細.金額,
    };
    this.補足 = props.補足;
    this.作成日時 = dayjs(props.作成日時);
    this.削除済み = props.削除済み;
  }
}

async function _削除(this: 鉢) {
  // isDeletedを True にする
  // 一旦論理削除のみ
  await FSAppRepository.鉢.更新(this.id!, { 削除済み: true });
  鉢.events.削除.next({ item: this });
}

async function _詳細を更新<Key extends keyof 鉢['詳細'], V = 鉢['詳細'][Key]>(
  this: 鉢,
  key: Key,
  value: V,
  suppressEmit = false,
) {
  const updates = {
    [`詳細.${key}`]: value,
  };
  console.log('_詳細を更新', { updates });
  await FSAppRepository.鉢.更新(this.id!, updates);
  if (!suppressEmit) 鉢.events.詳細を更新.next({ プロパティ名: key, 更新後のValue: value });
}

async function _日光の強度を更新<Key extends keyof 日光の強度設定, V = 日光の強度設定[Key]>(
  this: 鉢,
  key: Key,
  value: V,
) {
  const updated = {
    ...this.詳細.日光の強度設定,
    [key]: value,
  };
  if (!value) {
    delete updated[key];
  }
  await FSAppRepository.鉢.更新(this.id!, {
    [`詳細.日光の強度設定`]: updated,
  });
  鉢.events.詳細を更新.next({ プロパティ名: key, 更新後のValue: value });
}

type 鉢の更新可能なフィールドのKey = Extract<keyof 鉢, 'name' | '補足' | '棚Id'>;
async function _フィールドを更新<Key extends 鉢の更新可能なフィールドのKey, V = 鉢[Key]>(this: 鉢, key: Key, value: V) {
  // isDeletedを True にする
  // 一旦論理削除のみ
  await FSAppRepository.鉢.更新(this.id!, {
    [key]: value,
  });
  鉢.events.フィールドを更新.next({ フィールド名: key, 更新後のValue: value });
}

export class 鉢 extends 鉢のBase {
  削除 = _削除;
  詳細を更新 = _詳細を更新;
  日光の強度を更新 = _日光の強度を更新;
  フィールドを更新 = _フィールドを更新;

  get 最後の灌水からの経過日数(): number | undefined {
    const 日時 = this.snapshot.最後の灌水?.日時;
    return optionalCall(日時, v => 今日.diff(v.startOf('day'), 'days'));
  }

  static 管理 = {
    新規作成: _新規作成する,
    植替え: _植替えする,
    灌水: _灌水する,
    成長を記録: _成長を記録する,
  };

  constructor(props: 鉢のBase) {
    super(props);
  }

  static events = {
    フィールドを更新: new Subject<{ フィールド名: string; 更新後のValue: any }>(),
    詳細を更新: new Subject<{ プロパティ名: string; 更新後のValue: any }>(),
    削除: new Subject<{ item: 鉢 }>(),
    管理: new Subject<{ type: 履歴.Type | '新規作成' }>(),
  };

  static create = () => {
    /**
     * 1. 鉢を生成するf
     * 2. 画像の更新歴を作成する
     * 3. 鉢の画像を更新する
     */
    // const 鉢 = new 鉢()
    // 画像の更新歴を作成する
  };
}

export namespace 鉢 {
  export type Id = 鉢Id;
  export type Snapshot = _Snapshot;
  export type デフォルト設定可能な鉢のプロパティ = Pick<鉢['詳細'], '耐寒温度' | '日光の強度設定'>;
}
