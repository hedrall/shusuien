import { Opaque, ValueOf } from 'type-fest';
import { UserId } from '@frontend/domain/model/user';
import dayjs, { Dayjs } from 'dayjs';
import { 履歴, 履歴の内容, 鉢サイズ } from '@frontend/domain/model/history';
import { 棚ID } from '@frontend/domain/model/tana';
import { optionalCall } from '@frontend/supports/functions';
import { _植替えする } from '@frontend/domain/model/item/operation/replant';
import { _新規作成する } from '@frontend/domain/model/item/operation/newItem';
import { _灌水する } from '@frontend/domain/model/item/operation/provideWater';
import { _成長を記録する } from '@frontend/domain/model/item/operation/docGrowth';
import { FSAppRepository } from '@frontend/domain/repository/firestore';
import { Subject } from 'rxjs';
import fs from 'firebase/firestore';
import { 季節 } from '@frontend/domain/const/season';
import { 今日 } from '@frontend/supports/date';

export type 鉢Id = Opaque<string, '鉢ID'>;

type Snapshot = {
  鉢のサイズ?: 鉢サイズ;
  最後の植替え?: Dayjs;
  最後の灌水?: {
    日時: Dayjs;
    量: 履歴の内容.灌水.量のKey型;
  };
  画像のURL?: string;
  small画像のURL?: string;
  更新日時: Dayjs;
};

export const 日光の強度 = {
  直射日光: '直射日光',
  '20%遮光': '20%遮光',
  '30%遮光': '30%遮光',
  '40%遮光': '40%遮光',
  '50%遮光': '50%遮光',
  '60%遮光': '60%遮光',
  半日陰: '半日陰',
} as const;
export type 日光の強度 = ValueOf<typeof 日光の強度>;
export const 日光の強度の短縮表現 = {
  直射日光: '直',
  '20%遮光': '-20%',
  '30%遮光': '-30%',
  '40%遮光': '-40%',
  '50%遮光': '-50%',
  '60%遮光': '-60%',
  半日陰: '半日陰',
} as const satisfies Record<日光の強度, string>;
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

export class 鉢のBase {
  id: 鉢Id | undefined;
  userId: UserId;
  name: string | undefined;
  棚Id: 棚ID;
  詳細: {
    科?: string;
    属?: string;
    種名?: string;
    耐寒温度?: number;
    日光の強度設定?: 日光の強度設定;
    水切れ日数?: number;
    入手元?: string;
    金額?: number;
  };
  補足?: string;
  // 履歴を畳み込んで得られるもの
  snapshot: Snapshot;
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
      画像のURL: props.snapshot.画像のURL,
      small画像のURL: props.snapshot.small画像のURL,
      更新日時: dayjs(props.snapshot.更新日時),
    };
    this.詳細 = {
      科: props.詳細.科,
      属: props.詳細.属,
      種名: props.詳細.種名,
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

const update = (cur: 鉢, 更新するsnapshotの項目: Partial<鉢['snapshot']>, 履歴の作成日時: Dayjs) => {
  return new 鉢({
    ...cur,
    snapshot: {
      ...cur.snapshot,
      ...更新するsnapshotの項目,
      更新日時: 履歴の作成日時,
    },
  });
};

function _履歴を適用(this: 鉢, 履歴: 履歴, small画像のURL: string | undefined, 画像を更新する = true) {
  const type = 履歴.内容.type;
  const common = { ...(画像を更新する && small画像のURL ? { small画像のURL } : {}) };
  switch (type) {
    case '植替え':
      // [更新項目] 鉢サイズ, 最後の植替え, 画像
      return update(
        this,
        {
          ...common,
          鉢のサイズ: 履歴.内容.鉢のサイズ,
          最後の植替え: 履歴.内容.植替え日時,
          画像のURL: 履歴.内容.植替え後の画像のURL,
        },
        履歴.作成日時,
      );
    case '灌水':
      // [更新項目] 最後の灌水
      return update(
        this,
        {
          ...common,
          最後の灌水: {
            日時: 履歴.作成日時,
            量: 履歴.内容.灌水量,
          },
        },
        履歴.作成日時,
      );
    case '成長の記録':
      // [更新項目] 画像?
      return update(
        this,
        {
          ...common,
          ...(履歴.内容.画像のURL ? { 画像のURL: 履歴.内容.画像のURL } : {}),
        },
        履歴.作成日時,
      );
    default:
      throw new Error(`実装されていません。type: ${type}`);
  }
}

async function _削除(this: 鉢) {
  // isDeletedを True にする
  // 一旦論理削除のみ
  await FSAppRepository.鉢.更新(this.id!, { 削除済み: true });
  鉢.events.削除.next({ item: this });
}

async function _詳細を更新<Key extends keyof 鉢['詳細'], V = 鉢['詳細'][Key]>(this: 鉢, key: Key, value: V) {
  const updates = {
    [`詳細.${key}`]: value,
  };
  console.log('_詳細を更新', { updates });
  await FSAppRepository.鉢.更新(this.id!, updates);
  鉢.events.詳細を更新.next({ プロパティ名: key, 更新後のValue: value });
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
  履歴を適用 = _履歴を適用;

  削除 = _削除;
  詳細を更新 = _詳細を更新;
  日光の強度を更新 = _日光の強度を更新;
  フィールドを更新 = _フィールドを更新;

  get 最後の灌水からの経過日数(): number | undefined {
    const 日時 = this.snapshot.最後の灌水?.日時;
    console.log({ 日時 });
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
    管理: new Subject<{ type: 履歴の内容.Type | '新規作成' }>(),
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

type _S = Snapshot;
export namespace 鉢 {
  export type Snapshot = _S;
  export type デフォルト設定可能な鉢のプロパティ = Pick<鉢['詳細'], '耐寒温度' | '日光の強度設定'>;
}
